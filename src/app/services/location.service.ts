import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private firestore: AngularFirestore) {}

  getLocations(): Observable<Location[]> {
    return this.firestore.collection<Location>('locations').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Location;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addLocation(location: Location): Promise<void> {
    location.AP = `${location.city},${location.country}`;
    return this.firestore.collection<Location>('locations').add(location).then();
  }

  updateLocation(id: string, location: Partial<Location>): Promise<void> {
    location.AP = `${location.city},${location.country}`;
    return this.firestore.doc<Location>(`locations/${id}`).update(location);
  }

  deleteLocation(id: string): Promise<void> {
    return this.firestore.doc<Location>(`locations/${id}`).delete();
  }

  deleteMultipleLocations(ids: string[]): Promise<void> {
    const batch = this.firestore.firestore.batch();
    ids.forEach(id => {
      const docRef = this.firestore.doc<Location>(`locations/${id}`).ref;
      batch.delete(docRef);
    });
    return batch.commit();
  }
}