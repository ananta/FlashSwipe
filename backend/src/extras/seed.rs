use sqlx::postgres::PgPool;
use argonautica::Hasher;
use uuid::Uuid;

pub async fn add_seed_data(pool: &PgPool) -> Result<(), sqlx::Error> {
    let hash_secret = std::env::var("HASH_SECRET").expect("HASH_SECRET must be set!");
    let mut hasher = Hasher::default();
    let hash = hasher.with_password("test").with_secret_key(hash_secret).hash().unwrap();
    let test_users = vec![
        (1, "test_1","--", "--" ),
        (2, "test_2","--", "--"),
        (3, "test_3","--", "--"),
    ];

    for (user_id, username, fname, lname) in test_users {
        sqlx::query!("INSERT INTO users (user_id, username, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5)", user_id, username, hash, fname, lname)
            .execute(pool)
            .await?;
    }

    let katakana_deck_id = Uuid::new_v4();
    let dbms_quiz_id = Uuid::new_v4();
    let test_decks = vec![
        (katakana_deck_id, "Katakana","Let's learn some new chars"),
        (dbms_quiz_id, "DBMS QUIZ","Database Manage Systems Basics"),
    ];

    for (_deck_id, title, desc) in test_decks {
        sqlx::query!("INSERT INTO decks (deck_id, title, description, published_by) VALUES ($1::UUID, $2, $3, $4)", _deck_id , title, desc, 1)
            .execute(pool)
        .await?;
    }

    // let deck_id = Uuid::new_v4();
    // sqlx::query!("INSERT INTO decks (deck_id, title, description, published_by) VALUES ($1::UUID, $2, $3, $4)", deck_id, "Katakana", "", 1)
    //     .execute(pool)
    // .await?;

    // Update the seed data for the demo
    let katakana_chars = vec![
        ("ア", "a"),
        ("イ", "i"),
        ("ウ", "u"),
        ("エ", "e"),
        ("オ", "o"),
        ("カ", "ka"),
        ("キ", "ki"),
        ("ク", "ku"),
        ("ケ", "ke"),
        ("コ", "ko"),
        ("サ", "sa"),
        ("シ", "shi"),
        ("ス", "su"),
        ("セ", "se"),
        ("ソ", "so"),
        ("タ", "ta"),
        ("チ", "chi"),
        ("ツ", "tsu"),
        ("テ", "te"),
        ("ト", "to"),
        ("ナ", "na"),
        ("ニ", "ni"),
        ("ヌ", "nu"),
        ("ネ", "ne"),
        ("ノ", "no"),
        ("ハ", "ha"),
        ("ヒ", "hi"),
        ("フ", "fu"),
        ("ヘ", "he"),
        ("ホ", "ho"),
        ("マ", "ma"),
        ("ミ", "mi"),
        ("ム", "mu"),
        ("メ", "me"),
        ("モ", "mo"),
        ("ヤ", "ya"),
        ("ユ", "yu")];

    for (chars, mean) in katakana_chars {
        let card_id = Uuid::new_v4();
        sqlx::query!("INSERT INTO cards (card_id, deck_id, front, back) VALUES ($1::UUID, $2::UUID, $3, $4)", card_id , katakana_deck_id, chars, mean)
            .execute(pool)
        .await?;
    }

    let quiz_questions = vec![
        ("Indexes can speed up data retrieval in a database.", true),
        ("Foreign keys establish relationships between tables in a database.", true),
        ("Normalization is the process of removing redundant data in a database.", true),
        ("Joins are used to combine data from multiple tables in a database.", true),
        ("Stored procedures are collections of SQL statements that can be executed as a single unit.", true),
        ("A schema is a collection of related database objects, such as tables and indexes.", true),
        ("The SQL SELECT statement is used to modify data in a database.", false),
        ("Primary keys are used to uniquely identify records in a table.", true),
];

    for (info, val) in quiz_questions {
        let card_id = Uuid::new_v4();
        sqlx::query!("INSERT INTO cards (card_id, deck_id, front, back) VALUES ($1::UUID, $2::UUID, $3, $4)", card_id , dbms_quiz_id, info, val.to_string())
            .execute(pool)
        .await?;
    }
    Ok(())
}
