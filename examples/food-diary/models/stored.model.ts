import { Model, PairisStore, persist } from '../deps.ts'

const store = new PairisStore(sessionStorage)

@persist(store)

export class StoredModel extends Model { }