use candid::{CandidType, Deserialize};
//use ic_cdk::storage;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone)]
struct Task {
    id: u64,
    title: String,
    description: String,
    completed: bool,
}

thread_local! {
    static TASKS: RefCell<HashMap<u64, Task>> = RefCell::new(HashMap::new());
    static NEXT_ID: RefCell<u64> = RefCell::new(0);
}

#[ic_cdk::query]
fn get_tasks() -> Vec<Task> {
    TASKS.with(|tasks| tasks.borrow().values().cloned().collect())
}

#[ic_cdk::update]
fn create_task(title: String, description: String) -> Task {
    let id = NEXT_ID.with(|n| {
        let mut val = n.borrow_mut();
        let curr = *val;
        *val += 1;
        curr
    });

    let task = Task {
        id,
        title,
        description,
        completed: false,
    };

    TASKS.with(|tasks| {
        tasks.borrow_mut().insert(id, task.clone());
    });

    task
}

#[ic_cdk::update]
fn update_task(id: u64, title: String, description: String, completed: bool) -> Option<Task> {
    TASKS.with(|tasks| {
        let mut t = tasks.borrow_mut();
        if let Some(task) = t.get_mut(&id) {
            task.title = title;
            task.description = description;
            task.completed = completed;
            return Some(task.clone());
        }
        None
    })
}

#[ic_cdk::update]
fn delete_task(id: u64) -> bool {
    TASKS.with(|tasks| tasks.borrow_mut().remove(&id).is_some())
}
