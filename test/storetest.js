var MemStoreManage = require('../lib/store/MemStoreManage');
console.dir(MemStoreManage);
MemStoreManage.put('some','xxx');
var MemStoreManage2 = require('../lib/store/MemStoreManage');
console.log(MemStoreManage2.get('some'));
//var store = new MemStoreManage();
//store.put('some', 'xxx');
//var store2 = new MemStoreManage();
//console.log(store2.get('some'));