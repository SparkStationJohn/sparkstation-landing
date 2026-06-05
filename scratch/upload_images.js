import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.JJ_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'marketing-assets';

const publicImages = [
  'spark_card_home.png',
  'spark_go_home.png',
  'spark_phone_home.png',
  'spark_stand_home.png',
  'spark_tag_home.png',
  'sparked_artisan_vase.png'
];

const assetImages = [
  'card.png',
  'go.png',
  'sparkcard.png',
  'sparkcard_pro.png',
  'sparkgo.png',
  'sparkgo_clean.png',
  'sparktag.png',
  'sparktag_clean.png',
  'stand.png'
];

async function uploadFile(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      upsert: true,
      contentType: 'image/png'
    });

  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
  } else {
    console.log(`Successfully uploaded ${fileName}`);
  }
}

async function run() {
  console.log('🚀 Starting image migration to Supabase Storage...');

  // Ensure bucket exists (just in case, though it should already)
  await supabase.storage.createBucket(BUCKET_NAME, { public: true });

  for (const img of publicImages) {
    await uploadFile(path.join('public', img), img);
  }

  for (const img of assetImages) {
    await uploadFile(path.join('public', 'assets', img), img);
  }

  console.log('✅ Migration complete!');
}

run();
