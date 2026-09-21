// Training photo is real; NDR geometry is explicitly an illustrative concept.
const pair=(th,en)=>({th,en});
export const boards={
  training:{name:'QWA309 Training Kit',short:'Training',status:pair('SDK และตัวอย่างต้นทาง','SDK & source examples'),image:'assets/training-board.webp',kind:'actual',
    caption:pair('ภาพชุด Training จริง · QWA309 + KIT_PSE84_AI','Actual Training assembly · QWA309 + KIT_PSE84_AI'),
    hotspots:[
      {id:'display',x:52,y:22,icon:'display',title:pair('จอสัมผัส','Touch display'),spec:'4.3″ LCD / LVGL',desc:pair('สร้าง Dashboard และ HMI ที่โต้ตอบได้ เริ่มจากข้อมูล Sensor หรือหน้าจอ Wi-Fi Manager','Build interactive dashboards and HMIs, from sensor views to an on-screen Wi-Fi manager.'),href:'examples.html?category=dashboard'},
      {id:'compute',x:22,y:47,icon:'chip',title:pair('แกนประมวลผล','Compute module'),spec:'PSoC™ Edge E84',desc:pair('ชุด KIT_PSE84_AI เป็น Controller ของ Training Assembly ไม่ใช่ TSOM-002 แบบบอร์ด NDR','KIT_PSE84_AI controls the Training assembly. It is not the same module/carrier combination as the new NDR board.'),href:'https://tesaiot.github.io/tesaiot-pse84-devkit-sdk/'},
      {id:'sensor',x:30,y:47,icon:'sensor',title:pair('Sensor และ Audio','Sensors & audio'),spec:'IMU / ENVIRONMENT / PDM',desc:pair('สำรวจ Motion, ความดัน, อุณหภูมิ, ความชื้น และเสียง อุปกรณ์ที่ใช้ขึ้นกับ Example และชุด Kit','Explore motion, pressure, temperature, humidity and audio. Required devices depend on the example and kit configuration.'),href:'examples.html?category=sensors'},
      {id:'expand',x:31,y:79,icon:'expand',title:pair('ช่องต่อขยาย','Expansion headers'),spec:'mikroBUS™ / ARDUINO',desc:pair('ต่ออุปกรณ์เพิ่มผ่าน Header ต้องตรวจแรงดัน ขาสัญญาณ และ Pin Map ของ Revision ที่ใช้งาน','Add peripherals through expansion headers. Check voltage levels, routing and the pin map for your board revision.'),href:'https://tesaiot.github.io/tesaiot-pse84-devkit-sdk/'},
      {id:'fieldbus',x:76,y:64,icon:'network',title:pair('สื่อสารกับอุปกรณ์อื่น','Connect external devices'),spec:'CAN / RS-485',desc:pair('Interface สำหรับการเชื่อมต่อระบบภายนอก ต้องเตรียมอุปกรณ์คู่ทดสอบและตั้งค่าสวิตช์ให้ถูกต้อง','Interfaces for external devices. Prepare a peer device and check the interface-selection switches before testing.'),href:'https://tesaiot.github.io/tesaiot-pse84-devkit-sdk/'},
      {id:'input',x:82,y:54,icon:'sliders',title:pair('หมุน แตะ กด','Turn, touch, press'),spec:'POT ×4 / BUTTONS / CAPSENSE',desc:pair('อ่าน Pot 4 ช่องบน QWA309 เป็นกราฟ หรือใช้ 3 ช่องเลือกสี RGB ผ่าน Threshold','Plot four QWA309 potentiometer inputs, or use three inputs to select RGB colors with a threshold.'),href:'examples.html?category=control'},
      {id:'matrix',x:76,y:36,icon:'grid',title:pair('แสดงผลเป็นสี','Make it light up'),spec:'RGB LED MATRIX',desc:pair('ใช้ Matrix เป็น Output ที่มองเห็นได้ ตัวอย่าง Pot → RGB เลือกสี 8 สีจาก Threshold 50%','Use the matrix as visible feedback. The Pot → RGB example selects eight colors using a 50% threshold.'),href:'examples.html#rgb'},
      {id:'security',x:25,y:32,icon:'shield',title:pair('โมดูลความปลอดภัยเสริม','Optional security module'),spec:'OPTIGA™ TRUST M',desc:pair('ภาพแสดงโมดูลเสียบเสริม เว็บไซต์ต้นทางระบุว่าแยกจำหน่าย ไม่ถือว่ารวมอยู่ในทุกชุด','The pictured plug-in module is listed separately by the source website. Do not assume it is included in every kit.'),href:'https://tesaiot.github.io/tesaiot-pse84-devkit-sdk/'}
    ],
    groups:[
      {id:'power',icon:'power',title:'Power',bus:'USB / BOARD POWER',desc:pair('ตรวจแหล่งจ่ายและแรงดันตามคู่มือบอร์ดก่อนเสียบอุปกรณ์เสริม','Check the board power requirements and voltage levels before adding peripherals.')},
      {id:'input',icon:'sliders',title:'Input & control',bus:'ADC / GPIO / I²C',desc:pair('Pot 4 ช่อง, ปุ่มกด และ CapSense บน QWA309 Base สำหรับฝึกอ่าน Input','Four potentiometers, buttons and CapSense on the QWA309 base provide hands-on input exercises.')},
      {id:'sensor',icon:'sensor',title:'Sensors & audio',bus:'I²C / I3C / PDM',desc:pair('Sensor และ Microphone ของชุด Kit แยกจาก Input ของ QWA309 Base','Kit sensors and microphones are distinct from the QWA309 base-board inputs.')},
      {id:'display',icon:'display',title:'Display & RGB',bus:'LCD / TOUCH / I²C',desc:pair('LCD สัมผัสและ RGB Matrix ช่วยให้เห็นผลลัพธ์ของโค้ด','The touch display and RGB matrix turn code into visible feedback.')},
      {id:'fieldbus',icon:'network',title:'CAN / RS-485',bus:'EXTERNAL DEVICE',desc:pair('ต่อระบบภายนอกตามวงจรและการเลือก Interface ของบอร์ด','Connect external devices using the board-specific circuitry and interface configuration.')},
      {id:'expand',icon:'expand',title:'Expansion',bus:'mikroBUS / ARDUINO',desc:pair('Header สำหรับต่อยอด ไม่ใช่ Pinout เดียวกับ NDR Base','Expansion headers for additional hardware; not the same pinout as the NDR base.')}
    ]
  },
  ndr:{name:'TSOM + NDR Base',short:'TSOM / NDR',status:pair('แนวคิดบอร์ดใหม่ · รอยืนยัน Revision','New-board concept · revision pending'),image:'assets/ndr-concept.svg',kind:'concept',
    caption:pair('ภาพจำลอง SOM + Base · รูปทรงและตำแหน่งอุปกรณ์ยังไม่ยืนยัน','Illustrative SOM + carrier concept · not a finished NDR PCB'),
    hotspots:[
      {id:'compute',x:50,y:34,icon:'chip',title:pair('ส่วน TSOM','TSOM module'),spec:'PSoC™ EDGE E84',desc:pair('ส่วนประมวลผลในภาพจำลอง ต้องตรวจ SOM และ Base แยกกัน ไม่สืบทอดผลทดสอบจาก Carrier อื่น','Compute module in the illustration. Validate the SOM and base separately; another carrier’s results do not certify this base.'),href:'#architecture'},
      {id:'base',x:52,y:67,icon:'board',title:pair('Base Board ใหม่','New base-board concept'),spec:'CARRIER / DEVELOPMENT PREVIEW',desc:pair('ภาพจำลองแสดงโครงสร้างเท่านั้น รูปทรง ตำแหน่งชิ้นส่วนและขั้วต่อไม่ใช่ Layout จริง ให้ดูร่าง Block Diagram และยืนยัน Revision/BSP','The illustration explains structure only. Shapes, parts and connector positions are not a final layout. Review the draft block diagram and confirm revision/BSP.'),href:'#architecture'}
    ],
    groups:[
      {id:'power',icon:'power',title:'Power',bus:'5V → 3.3V / AUX 1.8V',desc:pair('ร่างระบุ USB-C 5V, PMIC Buck และ Auxiliary 1.8V สำหรับ Level Shift ต้องยืนยัน Power Budget','The draft shows USB-C 5V, a PMIC buck stage and auxiliary 1.8V level-shift rail. Confirm the final power budget.')},
      {id:'gpio',icon:'expand',title:'40-pin GPIO',bus:'EXPANSION HEADER',desc:pair('ร่างระบุ Header รูปแบบ RPi-compatible ไม่ใช่การรับรอง Pinout/แรงดัน ต้องตรวจรายละเอียด Revision','The draft describes an RPi-compatible header format. Confirm the exact pinout and voltage levels for the revision.')},
      {id:'usb',icon:'usb',title:'USB Host / Device',bus:'SHARED / MULTIPLEXED',desc:pair('USB-A Host และ USB-C Device ใช้ USB PHY ร่วมผ่าน Switch ไม่ควรสื่อว่าทำงานพร้อมกัน USB Camera ต้องทดสอบ Host/Power/BSP/รุ่นกล้อง','USB-A Host and USB-C Device share a PHY through a switch; do not assume simultaneous operation. A USB camera needs Host, power, BSP and device validation.')},
      {id:'display',icon:'display',title:'MIPI-DSI display',bus:'FPC / EXTERNAL DISPLAY',desc:pair('Connector สำหรับจอภายนอกในแบบร่าง ไม่ถือว่าจอหรือ Touch รวมอยู่บน Base','A connector for an external display in the draft. This does not mean a display or touch controller is included on the base.')},
      {id:'audio',icon:'audio',title:'Audio & microphone',bus:'I²S / CODEC / MEMS MIC',desc:pair('ร่างมี I²S Audio Codec, แจ็ก 3.5 มม. และ Digital MEMS Microphone ต้องยืนยัน Routing/BSP','The draft includes an I²S codec, 3.5 mm jack and digital MEMS microphone. Routing and BSP support need confirmation.')},
      {id:'ethernet',icon:'network',title:'Ethernet',bus:'10/100 · OPTIONAL',optional:true,desc:pair('Ethernet ในร่างเป็นตัวเลือก ไม่ใช่สเปกที่ยืนยันแล้ว','Ethernet is optional in the draft, not a confirmed feature of the final board.')},
      {id:'storage',icon:'storage',title:'Local storage',bus:'microSD',desc:pair('ช่อง microSD ในร่างสำหรับข้อมูล ต้องตรวจ Driver และอุปกรณ์ที่รองรับ','The draft includes microSD for local data. Verify the driver and supported cards.')},
      {id:'debug',icon:'code',title:'Debug',bus:'SWD / JTAG',desc:pair('Debug Header ตามร่าง ต้องยืนยัน Connector และ Pin Assignment ฉบับสุดท้าย','Debug header shown in the draft; confirm the connector and final pin assignment.')}
    ]
  }
};
