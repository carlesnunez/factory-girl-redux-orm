factory-girl-mongoose
=====================

A [ReduxORM](https://github.com/tommikaikkonen/redux-orm) adapter for [factory-girl](https://github.com/aexmachina/factory-girl)
## Usage

```javascript
import { factory } from 'factory-girl';
import ReduxORMAdapter from 'factory-girl-redux-orm';
import orm from '<YOUR REDUX ORM  MODELS DIRECTORY'>

const session = orm.session(); // Before withMutations;
factory.setAdapter(new ReduxORMAdapter(session));
```
