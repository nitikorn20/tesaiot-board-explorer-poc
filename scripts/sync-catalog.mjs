import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Explicit public-source allowlist. No recursive repository or workspace export.
const root = new URL('../', import.meta.url);
const episode = 'e48fbd2a8d786730e30aed96eb129150e2bcf66d';
const practise = '372d0d849578a6a49b634d3ecaab8b5958166921';
const sdk = 'ef72c1b658178eee8c38b1e47d28b006f80a59b5';
const selections = [
  { id:'motion', path:'int_ep02_bmi270_motion_visual', category:'sensors', title:'Motion, made visible.', subtitle:'BMI270 Motion Visual', hardware:['BMI270 IMU','LCD / LVGL'], outcome:'เห็นการเคลื่อนไหว 6 แกนจาก Accelerometer และ Gyroscope บนหน้าจอ', featured:true },
  { id:'rgb', path:'prac_qwa309_pot_rgb_mixer', category:'control', title:'Turn. Mix. Light up.', subtitle:'Pot → RGB Mixer', hardware:['QWA309 Pot ×3','DFR0522 RGB Matrix','LCD / LVGL'], outcome:'หมุน Pot 3 ตัวเพื่อเปิด–ปิดช่องสี R/G/B ด้วย Threshold 50% เกิดสีผสม 8 สี ไม่ใช่การหรี่สีต่อเนื่อง', featured:true },
  { id:'sensorhub', path:'int_ep07_sensorhub_final', category:'dashboard', title:'One screen. Every sensor.', subtitle:'SensorHub Dashboard', hardware:['DPS368','SHT4x','BMI270','BMM350','PDM Mic','LCD / LVGL'], outcome:'รวมข้อมูลสิ่งแวดล้อม การเคลื่อนไหว สนามแม่เหล็ก และระดับเสียงใน Dashboard เดียว', note:'README ระบุขั้นตอนแก้ Vendor Code ของ BMM350 ก่อน Build ต้องอ่านข้อกำหนดต้นทาง', featured:true },
  { id:'audio', path:'int_ep06_digital_mic_probe', category:'audio', title:'See what you hear.', subtitle:'Digital Mic Probe', hardware:['Stereo PDM Microphone','LCD / LVGL'], outcome:'ดูระดับสัญญาณเสียงจาก Microphone ซ้าย–ขวา เป็น Level Meter ไม่ใช่ AI จำแนกเสียง' },
  { id:'climate', path:'int_ep03_sht40_indicator', category:'sensors', title:'A feel for the environment.', subtitle:'SHT40 Indicator', hardware:['SHT4x Sensor','LCD / LVGL'], outcome:'อ่านความชื้นสัมพัทธ์และอุณหภูมิ แล้วแสดงผลบนจอ เป็นจุดเริ่มต้นของ Environmental Monitor' },
  { id:'pressure', path:'int_ep01_dps368_monitor', category:'sensors', title:'Read the atmosphere.', subtitle:'DPS368 Monitor', hardware:['DPS368 Sensor','LCD / LVGL'], outcome:'อ่านความดันบรรยากาศและอุณหภูมิผ่าน I2C แล้วแสดงค่าบนหน้าจอ' },
  { id:'compass', path:'int_ep04_bmm350_compass', category:'sensors', title:'Find your direction.', subtitle:'BMM350 Compass', hardware:['BMM350 Magnetometer','I3C','LCD / LVGL'], outcome:'แสดงทิศทางจาก Magnetometer ในรูปแบบเข็มทิศบนหน้าจอ', note:'README ระบุ Vendor Code Fix ของ BMM350 ต้องตรวจ Calibration และสภาพแวดล้อมสนามแม่เหล็กก่อนใช้งาน' },
  { id:'scope', path:'prac_qwa309_adc_scope', category:'control', title:'Four inputs. One view.', subtitle:'4-Channel ADC Scope', hardware:['QWA309 Pot ×4','ADC','LCD / LVGL'], outcome:'แสดงค่า Pot ทั้ง 4 ตัวเป็นกราฟเลื่อนบน LVGL เพื่อสังเกต Input ที่เปลี่ยนไป ไม่ใช่เครื่องมือ Oscilloscope สำหรับงานวัดทั่วไป' },
  { id:'wifi', path:'hmi_ep07_final_wifi_manager', category:'connectivity', title:'Connect from the screen.', subtitle:'Wi-Fi Manager', hardware:['Wi-Fi','Touch LCD / LVGL'], outcome:'ตัวอย่าง HMI สำหรับจัดการการเชื่อมต่อ Wi-Fi ผ่านหน้าจอ อ่าน Requirements ของ Master Template ก่อนใช้' }
];
async function download(url) {
  const result = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!result.ok) throw new Error(`${result.status}: ${url}`);
  return result;
}
await mkdir(new URL('dist/assets/examples/',root),{recursive:true});
await mkdir(new URL('dist/data/',root),{recursive:true});
const examples = [];
for (const selected of selections) {
  const qwa = selected.path.startsWith('prac_');
  const ref = qwa ? practise : episode;
  const base = `https://raw.githubusercontent.com/tesaiot/developer-hub/${ref}/${selected.path}`;
  const metadata = await (await download(`${base}/metadata.json`)).json();
  if (!metadata.title || !Array.isArray(metadata.boards)) throw new Error(`Invalid metadata: ${selected.id}`);
  const imageSource = qwa ? `https://raw.githubusercontent.com/tesaiot/tesaiot-pse84-devkit-sdk/${sdk}/docs/assets/tesaiot-dev-kit.webp` : `${base}/${selected.path}.png`;
  const image = qwa ? 'assets/training-board.webp' : `assets/examples/${selected.id}.png`;
  await writeFile(new URL(`dist/${image}`,root), Buffer.from(await (await download(imageSource)).arrayBuffer()));
  examples.push({ ...selected, board:'training', image, imageSource,
    imageKind:qwa?'hardware-reference':'upstream-screenshot',
    originalTitle:metadata.title, description:metadata.description,
    difficulty:metadata.difficulty, tags:metadata.tags || [], originalBoards:metadata.boards,
    requirements:Object.keys(metadata).filter(key=>key.startsWith('requires_') && metadata[key] === true),
    source:`https://github.com/tesaiot/developer-hub/tree/${ref}/${selected.path}`,
    readme:`https://github.com/tesaiot/developer-hub/blob/${ref}/${selected.path}/README.md`,
    metadataSource:`${base}/metadata.json`, ref,
    branch:qwa?'tesaiot_dev_kit_practise_codes':'tesaiot_dev_kit_episodes'
  });
}
await writeFile(new URL('dist/data/catalog.json',root),JSON.stringify({
  schemaVersion:1, retrievedOn:new Date().toISOString().slice(0,10),
  sourceRepository:'https://github.com/tesaiot/developer-hub',
  compatibilityNotice:'Training เป็นหมวดค้นหา ไม่ใช่คำรับรอง Hardware Validation; ดู Original Board IDs, BSP และอุปกรณ์ใน README. ยังไม่มีรายการยืนยันสำหรับ NDR Base ใหม่ใน PoC นี้.',
  examples
},null,2)+'\n');
for (const name of ['LICENSE','NOTICE']) {
  const content = await (await download(`https://raw.githubusercontent.com/tesaiot/developer-hub/main/${name}`)).text();
  await writeFile(new URL(name === 'LICENSE' ? 'LICENSE' : 'UPSTREAM-NOTICE',root),content);
}
console.log(`Synced ${examples.length} public examples to ${fileURLToPath(new URL('dist/data/catalog.json',root))}`);
