# Pairis
<!-- Pairis is a simple alternative for using databases and ORMs in small-scale projects. It allows you to define models via TypeScript classes. All the data is stored into key:value pairs. This makes Pairis benificial to use it together with key:value  -->

> :warning: This is at a very early stage and more a **prove of concept**. I am looking forward to any suggestions and help.

Pairis is a simple data storage alternative to traditional databases for smaller projects. Data structures can be modeled like ordinary TypeScript classes with properties, methods, getters and setters, with the difference that all properties are automatically saved. When changes are made, events are automatically triggered, which in turn can be subscribed to. The fact that all data is stored in key/value pairs makes Pairis perfect for use with localStorage, for example. However, due to its modular design, storage types can be easily changed at any stage of development.

## Basic usage
```ts
//define a model with properties as you would normally do with typescript

class Animal extends Model {
    static list = 'animals'
    species!: string
    legs = 4       //default value
}

//using it like so
const tallAnimal = Animal.use()
tallAnimal.species = 'Giraffe'

//or using set()
tallAnimal.set({
    species = 'Giraffe'
})

//retrieving
tallAnimal.species  //'Giraffe'
tallAnimal.legs     //4
```

### Relationships
Pairis uses 3 basic types of relationships, which can be combined in a logical manner:
- One-To: points to one foreign object. The key is stored locally.
- To-One: again points to one foreign object but the key is stored into the foreign object.
- To-Many: points to more than one foreign object. keys are stored in foreign objects.

In order to make relationships work, we need to 'introduce' our models to each other with `myModel.introduce()`.

```ts
//basic relationship example
class Place extends Model {
    static list = 'places'
    description!: string
    //to-Many:
    animals: Animal[]
}
Place.introduce()
class Animal extends Model {
    static list = 'animals'
    //one-To:
    place:Place
}
Animal.introduce()
```
#### Naming Conventions

Relationships are defined and guessed by property names. Therefore it is important to retain some naming convetions.

- Propertys that are pointing to a single dataset (One-To) always have the same name as the class they are pointing to, in lowercase.
- Propertys that are pointing to more than one datasets (To-Many) have the same name as the list name of the model they are pointing to.
- To-One relations are recognized by propertys starting with '$', followd by the class name in lowercase.


```JSON
{
    "animals":["uid1"],
    "places":["uid2"]
    "uid1":["species":"giraffe"]
}
```


## Reactivity
Every dataset is fitted with a subscribe function, that triggers on any value change.
```ts
tallAnimal.subscribe(()=>{
    //...Tall Animal has changed. Now do something with it...
})
```

## Custom Methods
It is of course easily possible to use custom methods on datasets.
```ts
class Window extends Model {
    opened = false
    open() {
        this.opened = true
    }
    close() {
        this.opened = false
    }
}
const window = Window.use() //window.opened => false
window.open() //window.opened => true
window.close() //window.opened => false
```


### Under the hood
Pairis stores all the data into key/value pairs. It uses 'lists' to combine all datasets of a model. Each dataset is stored under a unique identifier which is generated automatically. The keys are in turn stored in a list, which is basically an array.

```JSON
{
    "homes":["uid4","uid5"],

    "uid4":{"name":"CoolWG","city":"Berlin"},
    "uid5":{"name":"NiceHouse","city":"London"},

    "flatmates":["uid1","uid2","uid3"],

    "uid1":{"name":"Robin", "home":"uid4"},
    "uid2":{"name":"Luca", "home":"uid4"},
    "uid3":{"name":"Aron","home":"uid5"},
}

```


## Persistence

```ts
const store = new PairisStore(localStorage)

@persist(store)
class Car extends Model {
    //...
}
```
<!-- ## Decorators [pending]
If you want to keep your model clean, you can use Class Decorators instead of static proerties.
```ts
@list('plants')
@store(store)
@singular('plnt')
@plural('plnts')
class Plant extends Model {
    //...
}
```

## Extending Pairis
... -->