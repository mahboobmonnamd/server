## How to use postgres connections

### to create new postgresql connection

```node
new Postgres(DBPostgresProperties);
```

create a new postgres object with the new connection properties with a connection name. Whenever we need to use this connection, pass the connection name in query functions
