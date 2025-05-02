const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://arayff:vemubNe3nMWlYEno@cluster0.8c5sjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function checkMongo() {
  try {
    await client.connect();
    console.log('✅ MongoDB подключен!');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Кластер отвечает');
  } catch (err) {
    console.error('❌ Ошибка подключения:', err);
  } finally {
    await client.close();
  }
}

checkMongo();
