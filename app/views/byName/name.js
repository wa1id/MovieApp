function(doc) {
	if(doc.type === 'acteur') {
		emit(doc.acteur, doc);
	}
};