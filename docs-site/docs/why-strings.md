---
sidebar_position: 2
---
# Why Strings?
JSON (JavaScript Object Notation) is now wildly popular (especially if you happen to be a JavaScript developer). JSON has three primitive types
1. String (`"example string"`)
2. Number (`3`)
3. Boolean (`true`)

And two structural types
1. Object (`{ }`)
2. Array (`[ ]`)

These five types make the modern web go round. Odds are, all of the data you receive from web APIs is JSON. Now traditionally in JavaScript, dates are objects, but serialized as strings. This introduces a problem with deserialization. Unlike strongly typed languages, JavaScript cannot automatically transform the serialized date strings into date objects. It's all just JSON, so it can't determine which fields to transform. This has caused much consternation in the JavaScript community over the years. See 
- https://stackoverflow.com/questions/4511705/how-to-parse-json-to-receive-a-date-object-in-javascript
- https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
- https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
- https://github.com/expressjs/body-parser/issues/17
- https://www.bennadel.com/blog/3115-maintaining-javascript-date-values-during-deserialization-with-a-json-reviver.htm

While the solutions above may sometimes work, they are ultimately somewhat unreliable hacks. They are just looking at string format to determine if the value should be transformed into an object. This is a problem whenever we use data types which are not offered in JSON. So iso-fns doesn’t use these types. It uses strings. It adopts a functional approach for all date operations, maintaining a natural API. 