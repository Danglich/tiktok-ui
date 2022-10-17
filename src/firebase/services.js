import firebase, { db } from './config';

export const addDocument = (collection, data) => {
    const query = db.collection(collection);

    query.add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const updateDocument = (collection, docId, data) => {
    const query = db.collection(collection).doc(docId);

    query.update(data);
};

export const deleteDocuments = async (collection, condition) => {
    console.log('add');
    let collectionRef = db.collection(collection);

    if (condition) {
        if (condition.id) {
            collectionRef.doc(condition.id).delete();
            return;
        } else {
            if (!condition.compareValue || !condition.compareValue.length) {
                // reset documents data
                return;
            }
            const query = collectionRef.where(
                condition.fieldName,
                condition.operator,
                condition.compareValue,
            );

            const snapshot = await query.get();

            const batchSize = snapshot.size;
            if (batchSize === 0) {
                // When there are no documents left, we are done
                return;
            }

            // Delete documents in a batch
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
    }
};
