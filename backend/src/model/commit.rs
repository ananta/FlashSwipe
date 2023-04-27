use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow};

#[derive(Deserialize, Serialize, FromRow)]
pub struct Commit {
    pub commits: i32,
    pub date: Option<NaiveDate>,
}

#[derive(Debug, sqlx::FromRow, serde::Serialize)]
pub struct Commits {
    count: i64,
    date: Option<NaiveDate>,
}
