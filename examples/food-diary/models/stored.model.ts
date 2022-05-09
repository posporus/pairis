import { Model, PairisStore, persist } from '../deps.ts'

const store = new PairisStore()

@persist(store)

export class StoredModel extends Model { }