// Editorial guidance from the already-reviewed hardware sources, not a sales BOM.
const pair=(th,en)=>({th,en});
export const boardGuides={
 training:{
  audience:pair('สำหรับเรียนรู้ Hardware และสร้าง Demo แบบลงมือทดลอง','For hands-on hardware learning and interactive demos'),
  status:pair('TRAINING · มี SDK และตัวอย่างต้นทาง','TRAINING · SDK & source examples'),
  sections:[
   {icon:'sliders',title:pair('เหมาะกับใคร / ทำอะไรได้','Who it’s for / What to build'),items:[
    pair('ผู้เรียน ผู้สอน และนักพัฒนาที่อยากเห็น Input → Output บนชุดทดลอง','Learners, educators and developers exploring input → output on a training assembly.'),
    pair('เริ่มจาก Pot → RGB, Sensor Dashboard หรือ Touch HMI แล้วค่อยต่อยอด Edge AI','Explore Pot → RGB, sensor dashboards or touch HMIs, then take a next step into Edge AI.')
   ]},
   {icon:'board',title:pair('Hardware ของชุดที่แสดง','Hardware in the shown assembly'),items:[
    pair('QWA309 Base: Pot 4 ช่อง, Buttons, CapSense, CAN / RS-485 และ Expansion Headers','QWA309 base: four pots, buttons, CapSense, CAN / RS-485 and expansion headers.'),
    pair('KIT_PSE84_AI เป็น Controller · ชุดที่แสดงมี Touch LCD, Sensors / Audio และ RGB Matrix','KIT_PSE84_AI controller; the shown assembly has a touch LCD, sensors / audio and RGB matrix.')
   ]},
   {icon:'expand',title:pair('อุปกรณ์ภายนอก / ตัวเลือกเสริม','External / optional hardware'),items:[
    pair('USB Camera เป็นอุปกรณ์ต่อเพิ่ม ต้องตรวจรุ่นกล้อง, Host, Power และ BSP','A USB camera is an external accessory; check the camera, host, power and BSP.'),
    pair('OPTIGA Trust M เป็นโมดูลเสริม · งาน CAN / RS-485 ต้องมีอุปกรณ์คู่ทดสอบ','OPTIGA Trust M is an optional module. CAN / RS-485 exercises need a peer device.')
   ]}
  ],
  note:pair('ภาพแสดงชุดประกอบอ้างอิง ไม่ใช่รายการของแถมในชุดขาย ตรวจ Revision, อุปกรณ์ที่มี และ Board ID ของแต่ละ Example ก่อนใช้','This is a reference assembly, not a confirmed in-box list. Check your revision, fitted hardware and each example’s original Board ID.')
 },
 ndr:{
  audience:pair('สำหรับผู้พัฒนาที่ต้องการสำรวจแพลตฟอร์ม SOM + Base ใหม่','For developers exploring a new SOM + carrier platform'),
  status:pair('DEVELOPMENT PREVIEW · Revision / BSP รอยืนยัน','DEVELOPMENT PREVIEW · Revision / BSP pending'),
  sections:[
   {icon:'chip',title:pair('เหมาะกับใคร / แนวทางต่อยอด','Who it’s for / Potential direction'),items:[
    pair('ผู้พัฒนาที่ต้องการแยก Compute Module ออกจาก Base และพร้อมทำ Validation ตาม Revision','Developers exploring separate compute and carrier hardware, with revision-specific validation.'),
    pair('แนวทางที่เสนอ: USB Vision, Audio หรือ Data Logger หลังยืนยัน Interface / BSP ไม่ใช่แอปพร้อมใช้','Potential paths: USB vision, audio or data logging after interface / BSP confirmation—not ready-to-run apps.')
   ]},
   {icon:'board',title:pair('Hardware ตามแบบร่าง','Hardware in the draft'),items:[
    pair('TSOM / PSoC Edge E84 + NDR Base ใหม่ · USB Host / Device ใช้ PHY ร่วมผ่าน Switch','TSOM / PSoC Edge E84 + new NDR base. USB host / device share a PHY through a switch.'),
    pair('ร่างมี GPIO Header, Audio, microSD และช่องต่อจอ MIPI-DSI ภายนอก · Ethernet เป็น Optional','The draft includes GPIO, audio, microSD and an external MIPI-DSI display connector. Ethernet is optional.')
   ]},
   {icon:'expand',title:pair('ต้องเพิ่ม / ต้องยืนยัน','Add-ons / Items to confirm'),items:[
    pair('กล้อง USB และจอภายนอกต้องเลือกแยก ตรวจ Host / Power / Driver / BSP และความเข้ากันได้','Select a USB camera and external display separately. Verify host, power, drivers, BSP and compatibility.'),
    pair('ไม่ถือว่ามี Pot, CapSense, RGB Matrix หรือ Touch LCD แบบ Training · ชุดขายยังไม่สรุป','Do not assume Training-style pots, CapSense, RGB matrix or touch LCD. Package contents are not finalized.')
   ]}
  ],
  note:pair('ภาพแนวคิด ไม่ใช่บอร์ดพร้อมจำหน่าย ยังไม่มี Example ที่ยืนยันบน NDR Base ใหม่ใน PoC นี้ แม้ใช้ชิปตระกูลเดียวกัน ผลของ Training / Carrier อื่นไม่ยืนยันบอร์ดนี้','Concept, not a board ready for sale. This PoC has no verified examples for the new NDR base. A shared chip family does not transfer Training / other-carrier validation.')
 }
};
