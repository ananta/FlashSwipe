// @generated automatically by Diesel CLI.

diesel::table! {
    rustaceans (id) {
        id -> Integer,
        name -> Text,
        email -> Text,
        created_at -> Timestamp,
    }
}
