import { useState, useEffect } from 'react';
import { db } from '~/firebase/config';

const useFirestore = (collection, condition) => {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        let collectionRef = db.collection(collection);

        if (collection === 'rooms') {
            collectionRef = collectionRef.orderBy('updateAt', 'desc');
        }

        if (collection === 'messages') {
            collectionRef = collectionRef.orderBy('createdAt', 'desc');
        }

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                // reset documents data
                setDocuments([]);
                return;
            }

            collectionRef = collectionRef.where(
                condition.fieldName,
                condition.operator,
                condition.compareValue,
            );
        }

        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setDocuments(documents);
        });

        return unsubscribe;
    }, [collection, condition]);

    return documents;
};

export default useFirestore;
