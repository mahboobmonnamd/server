## How to use postgres connections

### to create new postgresql connection

```node
new Postgres(DBPostgresProperties);
```

create a new postgres object with the new connection properties with a connection name. Whenever we need to use this connection, pass the connection name in query functions

#### query using transcations

```
Postgres.insertsUsingConnectionPoolAsTranscations(`query`, null)
      .then((succ) => {
        console.log(succ);
        res.send(200, {
          message: "s Test Data of get",
        });
      })
      .catch((err) => {
        console.log(err);
      });
```

will handle rollback with this.
