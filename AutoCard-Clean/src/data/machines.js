import machineCardSorting from "../assets/machine-card-sorting.jpg";
import machineQrValidation from "../assets/machine-qr-validation.jpg";
import machineCardFeeding from "../assets/machine-card-feeding.jpg";
import machineConveyorInspection from "../assets/machine-conveyor-inspection.jpg";

import mechienRfid from "../assets/RFID.jpg"
import mechineTorsionTester from "../assets/torsionTester.jpg"
import mechineSheetCollationMachine from "../assets/sheetCollationMachine.jpg"
import mechineCardLaserMechine from "../assets/cardLaserMarker.jpg"
import mechineModulePushpullTester from "../assets/modulePushpullTester.jpg"
import mechineManualAtr from "../assets/manualAtr.jpg"
import mechineManualImada from "../assets/manualmada.jpg"
const machines = [
  {
    name: "RFID Brushing Machine",
    image: mechienRfid,
    desc: "The RFID Brushing Machine is a precision surface preparation and cleaning system designed for RFID card and smart card manufacturing. It removes dust, burrs, adhesive residues, and surface contaminants from RFID inlays and card substrates, ensuring superior lamination quality, enhanced RFID performance, and consistent product reliability. Equipped with controlled brushing technology and integrated vacuum dust extraction, the machine delivers high-quality surface finishing while protecting delicate RFID antenna structures and embedded chip components.",
    features: [
      "High-Precision Surface Brushing",
      "RFID Inlay Cleaning & Preparation",
      "Integrated Vacuum Dust Collection",
      "Adjustable Brush Pressure Control",
      "Anti-Static Cleaning Process",
      "Consistent Surface Finishing",
      "Continuous Production Operation",
      "Industrial Grade Construction",
      "Low Maintenance Design",
      "Enhanced Quality Assurance"
    ],
  },
  {
    name: "Torsion Tester",
    image: mechineTorsionTester,
    desc: "The Torsion Tester is a high-precision quality testing system designed to evaluate the torsional strength, flexibility, and durability of smart cards, RFID cards, banking cards, SIM cards, and other plastic card products. The machine applies controlled twisting forces to simulate real-world mechanical stress, ensuring cards maintain structural integrity and functionality throughout their lifecycle. It is an essential solution for manufacturers seeking to meet international quality standards and deliver reliable, long-lasting card products.",
    features: [
      "Precision Torsion Testing",
      "Adjustable Twist Angle",
      "Smart Card Durability Testing",
      "RFID Card Quality Verification",

    ],
  },


  {
    name: "Sheet Collation Machine",
    image: mechineSheetCollationMachine,
    desc: "The Sheet Collation Machine is an advanced automation system designed for accurate sheet sequencing, alignment, and collection in smart card, RFID, secure document, and card manufacturing industries. The machine automatically gathers sheets from multiple stations, verifies sequence accuracy, and stacks them in the correct order for downstream production processes. With high-speed operation and sensor-based inspection, it minimizes manual handling, improves production efficiency, and ensures consistent product quality.",
    features: [
      "Automatic Sheet Feeding",
      "High-Speed Collation",
      "Accurate Sheet Alignment",
      "Multi-Station Collection",
      "Sensor-Based Verification",
      "Quality Assurance",
      "Reduced Manual Handling",
      "Industrial Grade Design",
    ],
  }, {
    name: "Card Laser Marker",
    image: mechineCardLaserMechine,
    desc: "The Card Laser Marker is a high-performance personalization and marking system designed for smart cards, RFID cards, banking cards, government ID cards, and access control cards. The machine integrates contact and contactless card reading, RFID mapping, high-speed laser marking, and automated verification to ensure accurate card personalization and traceability. Equipped with a 20W laser marking system and automatic rejection mechanism, it delivers precise marking, reliable data encoding validation, and consistent production quality for high-volume card manufacturing environments.",
    features: [
      "Feeder Magazine Capacity - 500 Cards",
      "Output Magazine Capacity - 500 Cards",
      "Automatic Rejection Box",
      "Up to 2500 Cards Per Hour",
      "Read Marking & Data Marking with Log"
    ],

  },
  {
    name: "Module Pushpull Tester",
    image: mechineModulePushpullTester,
    desc: "The Module Push-Pull Tester is a precision quality assurance system designed to evaluate the mechanical bonding strength and durability of smart card modules. The machine accurately measures the push and pull forces applied to embedded chip modules, ensuring compliance with international smart card manufacturing standards. In addition to force testing, the system supports pocket milling, window milling, and slot milling operations, making it an ideal solution for card manufacturing, testing laboratories, and quality control environments. Its advanced testing technology helps manufacturers verify module adhesion quality, reduce product failures, and ensure long-term card reliability",
    features: [
      "Accurate Force Testing",
      
      "Window Milling",
      "Slot Milling",
      "Push-Pull Force Measurement",
      "Quality Assurance & Validation"
    ]
  },
  {
    name: "Manual ATR Tester",
    image: mechineManualAtr,
    desc: "The Manual ATR Tester is a precision smart card testing system designed to verify the Answer To Reset (ATR) response of contact smart cards with exceptional accuracy and reliability. The machine enables operators to manually test single-chip, half-chip, and quarter-chip cards, ensuring proper chip functionality, communication integrity, and compliance with smart card standards. Built for quality control laboratories, card manufacturing facilities, and personalization centers, the Manual ATR Tester provides fast and dependable ATR validation, helping manufacturers identify defective cards before production and delivery.",
    features: [
      "Easy Operation",
      "Precision Engineered Design",
      "High Accuracy ATR Testing",
     
      "Single Chip Card Testing",
      "Half Chip Card Testing",
      "Quarter Chip Card Testing",
  
    
      
    ],

  },
  {
    name: "Manual Milling Machine with Imada",
    image: mechineManualImada,
    desc: "The Manual Milling Machine with Imada is a specialized smart card manufacturing and quality testing solution designed for precision pocket milling, module push-pull testing, and force verification applications. Equipped with an integrated Imada Force Gauge, the machine enables accurate measurement of module bonding strength and insertion force, ensuring compliance with smart card industry quality standards. Its robust construction and precision-engineered design make it ideal for smart card manufacturers, quality control laboratories, and R&D facilities requiring reliable milling and force testing capabilities.",
    features: [
      "Imada Force Gauge Integration",
      "Manual Pocket Milling",
      "Module Push-Pull Testing",
      "High Accuracy Measurement",
      "Smart Card Quality Testing",
      "RFID Card Support",
      "Reliable Force Verification",
      "Industrial Grade Construction",
    ],
  },

];

export default machines;
