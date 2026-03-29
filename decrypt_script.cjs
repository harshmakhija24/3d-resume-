const fs = require('fs');
const crypto = require('crypto');

async function decryptModel() {
  const encryptedData = fs.readFileSync('public/models/character.enc');
  
  // Create key (SHA-256 of "MyCharacter12")
  const passwordBuffer = Buffer.from("MyCharacter12");
  const hashedPassword = crypto.createHash('sha256').update(passwordBuffer).digest();
  const key = hashedPassword.slice(0, 32);

  const iv = encryptedData.slice(0, 16);
  const data = encryptedData.slice(16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  fs.writeFileSync('public/models/character_unencrypted.glb', decrypted);
  console.log('Decrypted successfully to public/models/character_unencrypted.glb');
}

decryptModel().catch(console.error);
