import { Model, PairisStore, persist } from '../deps.ts'

const store = new PairisStore(localStorage)

@persist(store)

export class StoredModel extends Model { }