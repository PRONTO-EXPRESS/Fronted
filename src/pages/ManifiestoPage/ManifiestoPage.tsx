import PageMeta from "../../components/common/PageMeta";
import PAGE_NAME from "../../pronto";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableMulti from "../../components/tables/BasicTableMulti";
import { BultosTable } from "../../components/tables/BasicTableMulti";
import { useEffect, useState } from "react";
import source_link from "../../repositori/source_repo";
import useApi from "../../hooks/useApi";
import { saveAs } from "file-saver";
import ExcelJS from 'exceljs';
import Button from "../../components/ui/button/Button";
import useCodigo from "../../hooks/useCodigo";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Swal from "sweetalert2";
import { EditIcon } from "../../icons";
import TextArea from "../../components/form/input/TextArea";
import { object, string, number } from 'yup';
import useForm from "../../hooks/useForm";
import Checkbox from "../../components/form/input/Checkbox";



interface Direccion {
  id: number;
  direccion: string;
  ciudad: string;
  estado: string;
  postal: string;
  pais_id: number;
}

interface Bulto {
  id_real: number;
  id: number;
  codigo: string;
  contenido: string;
  peso: string;
  pesoKilos: string;
  tipo: string;
  envia: string;
  direccionenvia: number;
  telefonoenvia: string;
  nombrerecibe: string;
  telefonorecibe: string;
  direccionrecibe: number;
  envia_direccion: Direccion;
  recibe_direccion: Direccion;
  costodolares: number;
}


const schma_insert = object({
 
  codigo_manifiesto: string(),
  bulto: number(),
  codigo: string(),
  pesolb: number(),
  tipo: string(),
  contenidoes: string(),
  envia: string(),
  direccionenvia: string(),
  telefonoenvia: string(),
  nombrerecibe: string(),
  telefonorecibe: string(),
  direccionrecibe: string(),
  atendido: string(),
 


})

export interface Item {
  id_real?: number | null;
  id: number;
  codigo: string;
  contenido: string;
  peso: number;
  pesoKilos: number;
  tipo: string;
  
  
  nombre_cliente_envia: string;
  direccion_cliente_envia: number;
  telefono_cliente_envia: string;

  nombre_cliente_recibe: string;
  direccion_cliente_recibe: number;
  telefono_cliente_recibe: string;

}


export interface Item_Bulto {
  id_real?: number | null;
  id: number;
  codigo: string;
  contenido: string;
  peso: number;
  pesoKilos: number;
  tipo: string;
  
  
  envia: string;
  direccionenvia: number;
  telefonoenvia: string;

  nombrerecibe: string;
  direccionrecibe: number;
  telefonorecibe: string;
}



export default function ManifiestoPage() {


 

  const contarTiposBultos = (bultos: Bulto[]) => {
    const idsUnicos = new Set<number>();
    let seco = 0;
    let frio = 0;
  
    for (const bulto of bultos) {
      if (!idsUnicos.has(bulto.id)) {
        idsUnicos.add(bulto.id);
  
        const tipo = bulto.tipo.trim().toLowerCase();
        if (tipo === "seco") seco++;
        else if (tipo === "frio") frio++;
      }
    }
  
    return {
      total: idsUnicos.size,
      seco,
      frio
    };
  }


  const handleChange_useForm = (e:any) => {
    const { name, value } = e.target;
    setValue(name, value);
  };
  

  

  const { llamado: removerBultoManifiesto } = useApi(`${source_link}/removerBultoManifiesto`);


  const {llamado: insertarBulto} = useApi(`${source_link}/insertarBulto`)

  const {llamado: obtenerNombreAleatorio} = useApi(`${source_link}/obtenerNombreAleatorio`)

  const {llamado: obtener_telefono_aleatoria} = useApi(`${source_link}/obtener_telefono_aleatoria`)


  const { llamado: getPaquetedata } = useApi(`${source_link}/getPaquetedata`);

  const { llamado: getBultos_Manifiesto } = useApi(`${source_link}/getBultos_Manifiesto`);

  const { llamado: insertar_numero_guia } = useApi(`${source_link}/insertar_numero_guia`);
  
  const {codigo,setCodigo} = useCodigo();

  const [useSameID, setUseSameID] = useState(false);


  const [frio, setFrio] = useState(false)
  const [seco, setSeco] = useState(false)

  const [usa, setUsa] = useState(false)
  const [gt, setGT] = useState(true)
  


  const { values, setValue } = useForm(schma_insert, { 
    codigo_manifiesto: codigo,
    bulto: 0,
    codigo: '',
    pesolb: 0,
    tipo: '',
    contenidoes: '',
    envia: '',
    direccionenvia: '',
    telefonoenvia: '',
    nombrerecibe: '',
    telefonorecibe: '',
    direccionrecibe: '',
    atendido: '',
  });


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);




  const closeModal = () => setIsModalOpen(false);
  const closeModal2 = () => setIsModalOpen2(false);


  
  const exportToExcel = async () => {
    if (!bultos || bultos.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para el manifiesto',
        confirmButtonText: 'Aceptar'
      });
      return;
    }


    const bultos_manifiesto = await obtener_manifiesto({
      id_number: "All",
      numero_guia: codigo
    },"POST")

    
  
    // Map data_bultos from bultos
    const data_bultos = await Promise.all(bultos_manifiesto.response.map(async (bulto: Bulto) => {

      
      

     
      // const dirrerecibe = resultado_data.response.recibe.direccion.toUpperCase();
      
      
      return {
        "SITEID": 23,
        "WAYBILLORIGINATOR":"F703",
        "AIRLINEPREFIX": 202,
        "AWBSERIALNUMBER": codigo,
        "WEIGHTCODE": "K",
        "FDAINDICATOR": "NO",
        "IMPORTINGCARRIER": "LR",
        "AMENDMENTFLAG": "A",
        "AMENDMENTCODE": 21,
        "ENTRYTYPE": 86,
        "CURRENCYCODE": "USD",
        "EXPRESSRELEASE": "Y",
        "HAWB": bulto.codigo,
        "Origen": "GUA",
        "DESTINO": "JFK",
        "PIEZAS": "1",
        "PESO": bulto.pesoKilos,
        "NOMBRE DEL SHIPPER": bulto.envia.toUpperCase(),
        "DIRECCION 1 SHIPPER": bulto.envia_direccion.direccion,
        "CIUDAD SHIPPER": bulto.envia_direccion.ciudad,
        "ESTADO REGION": bulto.envia_direccion.estado,
        "PAIS": bulto.envia_direccion.pais_id == 1 ? "GT" : "USA",
        "CODIGO POSTAL": "",
        "NOMBRE DEL CONSIGNATARIO": bulto.nombrerecibe.toUpperCase(),
        "DIRECCION CONSIGNATARIO": bulto.recibe_direccion.direccion,
        "CIUDAD CONSIGN": bulto.recibe_direccion.ciudad,
        "ESTADO": bulto.recibe_direccion.estado,
        "PAIS CONSIGN": bulto.recibe_direccion.pais_id == 2 ? "USA" : "GT",
        "CODIGO POSTAL CONSIGN": bulto.recibe_direccion.postal,
        "DESCRIPCION DE LA CARGA": bulto.contenido.toUpperCase() || "", // Si la traducción falla, se coloca un string vacío
        "BAG": bulto.id,
        "CONSIGNEETELEPHONE": bulto.telefonorecibe,
        "CUSTOMSVALUE":  bulto.costodolares,
      };
    }));
  
  
    console.log("Datos para exportar:", data_bultos);  // Debugging log to check data
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bultos');


    worksheet.mergeCells('A1:E1');

    worksheet.getCell('A1').value = 'MANIFIESTO DE CARGA   SEGUN GUIA';

    worksheet.getCell('A1').font = { 
      name: 'Arial', 
      size: 12 
    };

    worksheet.getCell('A1').alignment = {
      horizontal: 'center',
      vertical: 'middle'   
    };


    // ahora seteamos el valor de NoGUIA

    worksheet.getColumn('F').width = 40; 

    worksheet.getCell('F1').value = '202 - ' + codigo;

    worksheet.getCell('F1').font = { 
      name: 'Arial', 
      size: 12 
    };

    worksheet.getCell('F1').alignment = {
      vertical: 'bottom'   
    };

    //vamos a setear el widtht del resto

    worksheet.getColumn('A').width = 14.15; 
    worksheet.getColumn('B').width = 14.15; 
    worksheet.getColumn('C').width = 14.15; 
    worksheet.getColumn('D').width = 14.15; 
    worksheet.getColumn('E').width = 14.15; 
    worksheet.getColumn('G').width = 64; 
    worksheet.getColumn('H').width = 52; 
    worksheet.getColumn('I').width = 27; 
    worksheet.getColumn('J').width = 10; 
    worksheet.getColumn('K').width = 25; 
    worksheet.getColumn('L').width = 46; 
    worksheet.getColumn('M').width = 46; 
    worksheet.getColumn('N').width = 28; 
    worksheet.getColumn('O').width = 14.72; 
    worksheet.getColumn('P').width = 9.57; 
    worksheet.getColumn('Q').width = 26.14; 
    worksheet.getColumn('R').width = 110; 
    worksheet.getColumn('S').width = 10;


    //Define columns (headers)
    const miscolumns = [
      { header: 'HAWB', key: 'HAWB', color: '1F4E78', cel: 'A' },
      { header: 'Origen', key: 'Origen', color: '1F4E78', cel: 'B'},
      { header: 'DESTINO', key: 'DESTINO', color: '1F4E78', cel: 'C'},
      { header: 'PIEZAS', key: 'PIEZAS', color: '1F4E78', cel: 'D'},
      { header: 'PESO', key: 'PESO', color: '1F4E78', cel: 'E'},
      { header: 'NOMBRE DEL SHIPPER', key: 'NOMBRE DEL SHIPPER', color: '2f75b5', cel: 'F'},
      { header: 'DIRECCION 1 SHIPPER', key: 'DIRECCION 1 SHIPPER', color: '2f75b5', cel: 'G'},
      { header: 'CIUDAD SHIPPER', key: 'CIUDAD SHIPPER', color: '2f75b5', cel: 'H'},
      { header: 'ESTADO REGION', key: 'ESTADO REGION', color: '2f75b5', cel: 'I'},
      { header: 'PAIS', key: 'PAIS' , color: '2f75b5', cel: 'J'},
      { header: 'CODIGO POSTAL', key: 'CODIGO POSTAL', color: '2f75b5', cel: 'K'},
      { header: 'NOMBRE DEL CONSIGNATARIO', key: 'NOMBRE DEL CONSIGNATARIO', color: '5b75d5', cel: 'L'},
      { header: 'DIRECCION CONSIGNATARIO', key: 'DIRECCION CONSIGNATARIO', color: '5b75d5', cel: 'M'},
      { header: 'CIUDAD CONSIGN', key: 'CIUDAD CONSIGN', color: '5b75d5', cel: 'N'},
      { header: 'ESTADO', key: 'ESTADO' , color: '5b75d5', cel: 'O'},
      { header: 'PAIS', key: 'PAIS CONSIGN', color: '5b75d5', cel: 'P'},
      { header: 'CODIGO POSTAL', key: 'CODIGO POSTAL CONSIGN', color: '5b75d5', cel: 'Q'},
      { header: 'DESCRIPCION DE LA CARGA', key: 'DESCRIPCION DE LA CARGA', color: '1F4E78', cel: 'R'},
      { header: 'BAG', key: 'BAG', color: '1F4E78', cel: 'S'},
    ];


    worksheet.getRow(2).values = miscolumns.map(col => col.header);
    
    miscolumns.forEach((col, index) => {
      const colLetter = String.fromCharCode(65 + index);  // Convertir el índice en letra de columna (A, B, C, etc.)
      const cell = worksheet.getCell(`${colLetter}2`); // Obtener la celda correspondiente (A2, B2, C2, etc.)
      cell.value = col.header; // Asignar el valor del header
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: col.color } // Establecer el color de fondo
      };
      cell.alignment = {
        horizontal: 'center',  // Centrar el texto horizontalmente
        vertical: 'middle'     // Centrar el texto verticalmente
      };
      cell.font = {
        name: 'Arial',
        size: 12,
        color: { argb: 'FFFFFF' } // Blanco
      };

      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    });
    
    let row_number = 3;
    data_bultos.forEach(bulto => {
      miscolumns.forEach((col) => {
        const colLetter = col.cel; // Columna correspondiente (A, B, C, etc.)
        const cell = worksheet.getCell(colLetter + row_number); // Obtener la celda según la letra de columna
        cell.alignment = {
          wrapText: true,       // Permite que el texto se ajuste en múltiples líneas
          vertical: 'top',      // Alineación vertical superior (puedes usar 'middle' o 'bottom' también)
        };
        const string_cell_name = col.key as string;
    
        // Verificar si la propiedad existe en bulto antes de asignar el valor
        const value = string_cell_name in bulto
          ? bulto[string_cell_name as keyof typeof bulto]
          : '';

        
        // Asignar el valor al cell
        cell.value = value;
        
        // Formatear según el color y el estilo de las columnas definidas en miscolumns
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }

        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        cell.font = {
          name: 'Arial',
          size: 11,
          color: { argb: '000000' }
        };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });
      row_number += 1;
    });
  
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const fecha = new Date();
    const dia = fecha.getDate();
    const mesNombre = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const nombreArchivo = `Manifiesto Pronto Express ${dia} de ${mesNombre} ${anio}.xlsx`;

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, nombreArchivo);
    });

    // Guardar workbook 2 

    




    const workbook2 = new ExcelJS.Workbook();
    const worksheet2 = workbook2.addWorksheet('Bultos');


    worksheet2.mergeCells('A1:C1');

    worksheet2.getCell('A1').value = 'MANIFIESTO DE CARGA   SEGUN GUIA';

    worksheet2.getCell('A1').font = { 
      name: 'Arial', 
      size: 12 ,
      bold: true
    };

    worksheet2.getCell('A1').alignment = {
      horizontal: 'center',
      vertical: 'middle'   
    };


    //

    worksheet2.getColumn('D').width = 22; 

    worksheet2.getCell('D1').value = '202 - ' + codigo;

    worksheet2.getCell('D1').font = { 
      name: 'Arial', 
      size: 12 ,
      bold: true
    };

    worksheet2.getCell('D1').alignment = {
      vertical: 'bottom'   
    };

    ['A', 'B', 'C',  'E',  'G', 'H', 'J', 'M', 'N', 
      'O', 'P', 'Q', 'R', 'T','W','X','Y','AA',
    'AF','AG', 'AH', 'AI','AJ','AK','AL','AM','AN'
    ,'AO','AP','AQ','AR','AS','AT','AU','AV', 'AY','AZ','BC'].forEach(col => {
      worksheet2.getColumn(col).width = 28;
    });
    ['F', 'I', 'K','AW', 'AX','BA','BB','BD'].forEach(col => {
      worksheet2.getColumn(col).width = 16;
    });

    ['S', 'U','V','Z','AB','AC','AD', 'AE'].forEach(col => {
      worksheet2.getColumn(col).width = 40;
    });
    

    worksheet2.getColumn('L').width = 150;

    const miscolumns2 = [
      { header: 'SITEID', key: 'SITEID', cel: 'A' },
      { header: 'ARRIVALAIRPORT', key: 'DESTINO', cel: 'B' },
      { header: 'WAYBILLORIGINATOR', key: 'WAYBILLORIGINATOR', cel: 'C' },
      { header: 'AIRLINEPREFIX', key: 'AIRLINEPREFIX', cel: 'D' },
      { header: 'AWBSERIALNUMBER', key: 'AWBSERIALNUMBER', cel: 'E' },
      { header: 'HOUSEAWB', key: 'HAWB', cel: 'F' },
      { header: 'MASTERAWBINDICATOR', key: 'MASTERAWBINDICATOR', cel: 'G' },
      { header: 'ORIGINAIRPORT', key: 'Origen', cel: 'H' },
      { header: 'PIECES', key: 'PIEZAS', cel: 'I' },
      { header: 'WEIGHTCODE', key: 'WEIGHTCODE', cel: 'J' },
      { header: 'WEIGHT', key: 'PESO', cel: 'K' },
      { header: 'DESCRIPTION', key: 'DESCRIPCION DE LA CARGA', cel: 'L' },
      { header: 'FDAINDICATOR', key: 'FDAINDICATOR', cel: 'M' },
      { header: 'IMPORTINGCARRIER', key: 'IMPORTINGCARRIER', cel: 'N' },
      { header: 'FLIGHTNUMBER', key: 'FLIGHTNUMBER', cel: 'O' },
      { header: 'ARRIVALDAY', key: 'ARRIVALDAY', cel: 'P' },
      { header: 'ARRIVALMONTH', key: 'ARRIVALMONTH', cel: 'Q' },
      { header: 'SHIPPERNAME', key: 'NOMBRE DEL SHIPPER', cel: 'R' },
      { header: 'SHIPPERSTREETADDRESS', key: 'DIRECCION 1 SHIPPER', cel: 'S' },
      { header: 'SHIPPERCITY', key: 'CIUDAD SHIPPER', cel: 'T' },
      { header: 'SHIPPERSTATEORPROVINCE', key: 'SHIPPERSTATEORPROVINCE', cel: 'U' },
      { header: 'SHIPPERPOSTALCODE', key: 'SHIPPERPOSTALCODE', cel: 'V' },
      { header: 'SHIPPERCOUNTRY', key: 'PAIS', cel: 'W' },
      { header: 'SHIPPERTELEPHONE', key: 'SHIPPERTELEPHONE', cel: 'X' },
      { header: 'CONSIGNEENAME', key: 'NOMBRE DEL CONSIGNATARIO', cel: 'Y' },
      { header: 'CONSIGNEESTREETADDRESS', key: 'DIRECCION CONSIGNATARIO', cel: 'Z' },
      { header: 'CONSIGNEECITY', key: 'CIUDAD CONSIGN', cel: 'AA' },
      { header: 'CONSIGNEESTATEORPROVINCE', key: 'ESTADO', cel: 'AB' },
      { header: 'CONSIGNEEPOSTALCODE', key: 'CODIGO POSTAL CONSIGN', cel: 'AC' },
      { header: 'CONSIGNEECOUNTRY', key: 'PAIS CONSIGN', cel: 'AD' },
      { header: 'CONSIGNEETELEPHONE', key: 'CONSIGNEETELEPHONE', cel: 'AE' },
      { header: 'AMENDMENTFLAG', key: 'AMENDMENTFLAG', cel: 'AF' },
      { header: 'AMENDMENTCODE', key: 'AMENDMENTCODE', cel: 'AG' },
      { header: 'AMENDMENTREASON', key: 'AMENDMENTREASON', cel: 'AH' },
      { header: 'PTPDESTINATION', key: 'PTPDESTINATION', cel: 'AI' },
      { header: 'PTPDESTINATIONDAY', key: 'PTPDESTINATIONDAY', cel: 'AJ' },
      { header: 'PTPDESTINATIONMONTH', key: 'PTPDESTINATIONMONTH', cel: 'AK' },
      { header: 'BOARDEDPIECES', key: 'BOARDEDPIECES', cel: 'AL' },
      { header: 'BOARDEDWEIGHTCODE', key: 'BOARDEDWEIGHTCODE', cel: 'AM' },
      { header: 'BOARDEDWEIGHT', key: 'BOARDEDWEIGHT', cel: 'AN' },
      { header: 'PARTIALSHIPMENTREF', key: 'PARTIALSHIPMENTREF', cel: 'AO' },
      { header: 'BROKERCODE', key: 'BROKERCODE', cel: 'AP' },
      { header: 'INBONDDESTINATION', key: 'INBONDDESTINATION', cel: 'AQ' },
      { header: 'INBONDDESTINATIONTYPE', key: 'INBONDDESTINATIONTYPE', cel: 'AR' },
      { header: 'BONDEDCARRIERID', key: 'BONDEDCARRIERID', cel: 'AS' },
      { header: 'ONWARDCARRIER', key: 'ONWARDCARRIER', cel: 'AT' },
      { header: 'BONDEDPREMISESID', key: 'BONDEDPREMISESID', cel: 'AU' },
      { header: 'TRANSFERCONTROLNUMBER', key: 'TRANSFERCONTROLNUMBER', cel: 'AV' },
      { header: 'ENTRYTYPE', key: 'ENTRYTYPE', cel: 'AW' },
      { header: 'ENTRYNUMBER', key: 'ENTRYNUMBER', cel: 'AX' },
      { header: 'COUNTRYOFORIGIN', key: 'PAIS', cel: 'AY' },
      { header: 'CUSTOMSVALUE', key: 'CUSTOMSVALUE', cel: 'AZ' },
      { header: 'CURRENCYCODE', key: 'CURRENCYCODE', cel: 'BA' },
      { header: 'HTSNUMBER', key: 'HTSNUMBER', cel: 'BB' },
      { header: 'EXPRESSRELEASE', key: 'EXPRESSRELEASE', cel: 'BC' },
      { header: 'BAG', key: 'BAG', cel: 'BD' },
    ];
    


    worksheet2.getRow(2).values = miscolumns2.map(col => col.header);
    




    miscolumns2.forEach((col) => {
      const colLetter = col.cel
      const cell = worksheet2.getCell(`${colLetter}2`); // Obtener la celda correspondiente (A2, B2, C2, etc.)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' } // Establecer el color de fondo
      };
      cell.alignment = {
        horizontal: 'center',  // Centrar el texto horizontalmente
        vertical: 'middle'     // Centrar el texto verticalmente
      };
      cell.font = {
        name: 'Arial',
        size: 12,
        color: { argb: '000000' } // Blanco
      };

      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    });

    let row_number2= 3;
    data_bultos.forEach(bulto => {
      miscolumns2.forEach((col) => {
        const colLetter = col.cel;
        const cell = worksheet2.getCell(colLetter + row_number2); 
        cell.alignment = {
          wrapText: true,
          vertical: 'top',
        };
        const string_cell_name = col.key as string;
    

        const value = string_cell_name in bulto
        ? bulto[string_cell_name as keyof typeof bulto]
        : '';

        
        // Asignar el valor al cell
        cell.value = value;
        
        // Formatear según el color y el estilo de las columnas definidas en miscolumns
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }

        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        cell.font = {
          name: 'Arial',
          size: 11,
          color: { argb: '000000' }
        };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });
      row_number2 += 1;
    });
    

    const nombreArchivo2 = `Manifiesto ${dia} de ${mesNombre} ${anio}.xlsx`;

    workbook2.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, nombreArchivo2);
    });


    
  };
  
  

  const [tableData_frios, setTableDataFrios] = useState<Item[]>([]);
  const [tableData_secos, setTableDataSecos] = useState<Item[]>([]);

  const [bultos_geted , setBultosGeted] = useState<Bulto[]>([])




  const [atiende, setAtiende] = useState('')

  const [bultos, setBultos] = useState<Item_Bulto[]>([]);
  const { llamado: obtener_paquetes_fecha_paquete } = useApi(`${source_link}/obtener_paquetes_fecha_tipo`);

  const { llamado: obtener_manifiesto } = useApi(`${source_link}/obtener_manifiesto`);

  const [codigomio, setCodigomio] = useState('')
  const [reload, setReload] = useState(false);

  const [peso_Total, setPesoTotal] = useState(0)

  const handleChangeGuia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCodigomio(value)
  }; 

  const handleAtiende = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAtiende(value)
  }; 

  

  const getWeekRange = () => { 
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - ((dayOfWeek + 3) % 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const formatISODate = (date: Date) => date.toISOString().split('T')[0];
    return {
      range: `${startDate.toLocaleDateString("es-ES")} - ${endDate.toLocaleDateString("es-ES")}`,
      fecha_inicio: formatISODate(startDate),
      fecha_fin: formatISODate(endDate)
    };
  };

  function obtenerIndiceItemTotalmenteUnico(items: Item[], bultos: Item_Bulto[]): number | null {
    const codigosBultos = new Set(bultos.map(b => b.codigo));
    const telefonosEnvia = new Set(bultos.map(b => b.telefonoenvia));
    const telefonosRecibe = new Set(bultos.map(b => b.telefonorecibe));
    const nombresEnvia = new Set(bultos.map(b => b.envia));
    const nombresRecibe = new Set(bultos.map(b => b.nombrerecibe));
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (
        !codigosBultos.has(item.codigo) &&
        !telefonosEnvia.has(item.telefono_cliente_envia) &&
        !telefonosRecibe.has(item.telefono_cliente_recibe) &&
        !nombresEnvia.has(item.nombre_cliente_envia) &&
        !nombresRecibe.has(item.nombre_cliente_recibe)
      ) {
        return i;
      }
    }
  
    return 0;
  }
  

  
  const { range, fecha_inicio, fecha_fin } = getWeekRange();

  useEffect(() => {
    if (codigo=='' || codigo == null ){
      setIsModalOpen(true)
     }
     
    
    const get_frios = async () => {
      const body_frio = { fecha_inicio, fecha_fin, tipo: "Frio" };
      const body_seco = { fecha_inicio, fecha_fin, tipo: "Seco" };
      const response = await obtener_paquetes_fecha_paquete(body_frio, "POST");
      const response2 = await obtener_paquetes_fecha_paquete(body_seco, "POST");
      const butos_body = {numero_guia: codigo}
      const reposne_bultos = await getBultos_Manifiesto(butos_body,"POST");
      
      

     
      
      setBultos(reposne_bultos.response.bultos);
      setPesoTotal(reposne_bultos.response.totalKilos)
      
      setTableDataFrios(response.response);
      setTableDataSecos(response2.response);


      console.log(response)
    };
    get_frios();
  }, [reload]);

  const addBulto = async (items: Item[]) => {
    const index = obtenerIndiceItemTotalmenteUnico(items, bultos);


    if (items.length === 0) return;
    let indice = 0
    if (index != null) {

      indice = index

    }
    const codigo_ = items[indice].codigo;
    const descripcion = items.map(item => item.contenido).join(", ");
    const peso = items.reduce((sum: number, item) => sum + (parseFloat(item.peso?.toString()) || 0), 0);


    

    const direcciones_ids = [
      ...bultos.map(item => item.direccionenvia),
      ...bultos.map(item => item.direccionrecibe)
    ];
    
    const ids_todos = items.map(item => item.id)


    const tipo = items[indice].tipo;
    const envia = items[indice].nombre_cliente_envia;
    const recibe = items[indice].nombre_cliente_recibe;

    const direccion_envia = items[indice].direccion_cliente_envia;
    const direccion_recibe = items[indice].direccion_cliente_recibe;

    const telefono_envia = items[indice].telefono_cliente_envia;
    const telefono_recibe = items[indice].telefono_cliente_recibe;


    let last_idBulto = bultos.length > 0 ? Math.max(...bultos.map(b => b.id)) : 0;

    if (!useSameID){
      last_idBulto += 1;
    }
    const body = {
      codigo_manifiesto: codigo,
      bulto:  last_idBulto,
      codigo: codigo_,
      pesolb: peso,
      tipo : tipo,
      contenidoes: descripcion,
      envia: envia,
      direccionenvia: direccion_envia,
      telefonoenvia: telefono_envia,
      nombrerecibe: recibe,
      telefonorecibe: telefono_recibe,
      direccionrecibe: direccion_recibe,
      atendido: atiende,
      direcciones_todas: direcciones_ids,
      id_frios_secos : ids_todos


    }

    const response = await insertarBulto(body, "POST");

    if (!response.success){
      closeModal2()
      Swal.fire({
        icon: 'error',
        title: 'Error al insertar los codigos',
        text: 'No es posible insertar el bulto',
        confirmButtonText: 'Aceptar'
      });


    }else{
      
      setReload(prev => !prev);
    }

  };

  const enviar_pedido =  async() => {

    let tipo_ = ''

    let direcciones_envua_ = 'GT'
    let direcciones_recibe_ = 'USA'

    if (seco){
      tipo_ = 'Seco'
    }else if(frio){
      tipo_ = 'Frio'
    }

    if(usa){
      direcciones_envua_ = 'USA'
      direcciones_recibe_ = 'GT'
    }else if (gt){
      direcciones_envua_ = 'GT'
      direcciones_recibe_ = 'USA'
    }
    
    const body = {
      codigo_manifiesto: codigo,
      bulto:  values.bulto,
      codigo: values.codigo,
      pesolb: values.pesolb,
      tipo : tipo_,
      contenidoes: values.contenidoes,
      envia: values.envia,
      direccionenvia: direcciones_envua_,
      telefonoenvia: '',
      nombrerecibe: values.nombrerecibe,
      telefonorecibe: values.telefonorecibe,
      direccionrecibe: direcciones_recibe_,
      atendido: values.atendido,
      direcciones_todas: [
        ...bultos.map(item => item.direccionenvia),
        ...bultos.map(item => item.direccionrecibe)
      ],
      id_frios_secos : []


    }


    const response = await insertarBulto(body, "POST");

    if (!response.success){
      Swal.fire({
        icon: 'error',
        title: 'Error al insertar los codigos',
        text: 'No es posible insertar el bulto',
        confirmButtonText: 'Aceptar'
      });


    }else{  

      setValue('codigo', '');
      setValue('tipo', '');
      setValue('envia', '');
      setValue('direccionenvia', '');
      setValue('telefonoenvia', '');
      setValue('nombrerecibe', '');
      setValue('telefonorecibe', '');
      setValue('direccionrecibe', '');

      
      setReload(prev => !prev);
    }

  }


  const add_Codigo = async () =>{

    setCodigo(codigomio)

    const body = {
      numero_guia: codigomio
    }
    const response = await insertar_numero_guia(body, "POST")

    if (response.numero_guia == codigomio || response){
      closeModal();
      setReload(prev => !prev);
    }else{
      closeModal();
      Swal.fire({
        icon: 'error',
        title: 'Error al insertar codigo',
        text: 'No es posible insertar el codigo de manera exitosa',
        confirmButtonText: 'Aceptar'
      });
    }
    

  }



  const addSameBulto = (items: Item[]) => {
    console.log(items)
  };


  const delete_id_bulto = async (id:number) => {

    const body = {
      id_bulto: id
    }
    await removerBultoManifiesto(body, "DELETE");
    setReload(prev => !prev);
  }


  const obtener_nombre_envia = async() => {
    const nombres = [
      ...bultos.map(item => item.nombrerecibe),
      ...bultos.map(item => item.envia)
    ];
    


    const response = await  obtenerNombreAleatorio({

      nombres_excluidos: nombres
    }, "POST")

    if (response.success){
      setValue("envia", response.respuesta.id)
      console.log(response.respuesta.id)
    }else{
      setValue("envia", "No tenemos mas nombres")
    }

  }

  const obtener_nombre_recibe = async() => {
    const nombres = [
      ...bultos.map(item => item.nombrerecibe),
      ...bultos.map(item => item.envia)
    ];
    


    const response = await  obtenerNombreAleatorio({

      nombres_excluidos: nombres
    }, "POST")

    if (response.success){
      setValue("nombrerecibe", response.respuesta.id)
    }else{
      setValue("envia", "No tenemos mas nombres")
    }

  }

  const obtener_telefono =  async (estado_id:number) => {
    const response  = await obtener_telefono_aleatoria({
      estado: estado_id,
      telefonos_excluidos: [
        ...bultos.map(item => item.telefonoenvia),
        ...bultos.map(item => item.telefonorecibe)
      ]
    }, "POST")

    if (!response.success) {

      setValue("telefonorecibe", "No hay mas telefonos")

    }else{
      setValue("telefonorecibe", response.respuesta.telefono)
    }

  }

 
  

  // Calcular el peso total de los bultos en libras y convertir a kilos
 

  return (
    <>
        <Modal isOpen={isModalOpen} onClose={closeModal} showCloseButton={true}>
          <div>
          <ComponentCard title="No tienes numero Guia">
            <div className="space-y-0">
            <Label htmlFor="codigo">Insertar numero Guia</Label>
                <Input 
                  type="text" 
                  id="codigomio"
                  value={codigomio}
                  name="codigomio"
                  onChange={handleChangeGuia}
                />
                <br></br>
                <Button size="sm" onClick={add_Codigo}>
              Agregar Numero Guia
                </Button>
            </div>
          </ComponentCard>
          </div>
        </Modal>

        <Modal isOpen={isModalOpen2} onClose={closeModal2} showCloseButton={true}>
  <div>
    <ComponentCard title="Agregar Nuevo Bulto">

          {/* Numero de Bulto */}
          <div>
            <Label htmlFor="bulto">Numero de Bulto</Label>
            <Input
              type="number"
              id="bulto"
              value={values.bulto}
              name="bulto"
              onChange={handleChange_useForm}
            />
          </div>
          {/* Nombre Envia y Nombre Recibe */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Nombre Envia */}
            <div style={{ flex: 1 }}>
              <Label>Nombre Envia</Label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Input
                  type="text"
                  value={values.envia}
                  name="envia"
                  onChange={handleChange_useForm}
                />
                <Button size="sm" onClick={obtener_nombre_envia}>Obtener Nombre</Button>
              </div>
            </div>

            {/* Nombre Recibe */}
            <div style={{ flex: 1 }}>
              <Label>Nombre Recibe</Label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Input
                  type="text"
                  value={values.nombrerecibe}
                  name="nombrerecibe"
                  onChange={handleChange_useForm}
                />
                <Button size="sm" onClick={obtener_nombre_recibe}>Obtener Nombre</Button>
              </div>
            </div>
            
          </div>


          {/* Teléfono */}
          <div style={{ display: 'flex', gap: '10rem', flexWrap: 'wrap' }}>
          <div>
              <Label>Tipo de Envio:</Label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label>
              <Checkbox
                checked={gt}
                onChange={setGT}
                label=" Guatemala a USA"
              />
            </label>
            <label>
            <Checkbox
                checked={usa}
                onChange={setUsa}
                label="USA a GT"
              />

            </label>
            
          </div>    
            </div>
          <div>
            <Label>Telefono Recibe</Label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Input
                type="number"
                value={values.telefonorecibe}
                name="telefonorecibe"
                onChange={handleChange_useForm}
              />
              <Button size="sm" onClick={()=>obtener_telefono(1)}>Numero M</Button>
              <Button size="sm" onClick={()=>obtener_telefono(2)}>Numero NY</Button>
            </div>
          </div>
          </div>
          {/* Contenido */}
          <div>
            <Label>Contenido</Label>
            <TextArea rows={3} 
              value={values.contenidoes} 
              onChange={(value) => setValue("contenidoes",value)}

            />
          </div>

          {/* Peso y Código */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <Label>Peso lb:</Label>
              <Input
                type="number"
                value={values.pesolb}
                name="pesolb"
                onChange={handleChange_useForm}
              />
            </div>
            <div>
              <Label>Codigo:</Label>
              <Input
                type="text"
                value={values.codigo}
                name="codigo"
                onChange={handleChange_useForm}
              />
            </div>

            <div>
              <Label>Atendido por:</Label>
              <Input
                type="text"
                value={values.atendido}
                name="atendido"
                onChange={handleChange_useForm}
              />
            </div>
            <div>
              <Label>Tipo:</Label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label>
            <Checkbox 
          checked={seco} 
          onChange={setSeco}
          label="SECO" />
          
               </label>
            <label>
            <Checkbox 
          checked={frio} 
          onChange={setFrio}
          label="FRIO" />
            </label>
            
          </div>    
            </div>
          </div>

          {/* SECO / FRIO y Atendido */}
          <Button
            size="sm"
            onClick={enviar_pedido}
            className="w-full"
          >
            Insertar Bulto
          </Button>


        </ComponentCard>
      </div>
    </Modal>


      <PageMeta
        title={`${PAGE_NAME} - Manifiesto`}
        description="Esta es la página de tablas básicas para el Dashboard de TailAdmin en React.js y Tailwind CSS"
      />

      <div style={{flexDirection: 'row', display: 'flex', gap: '2rem'}}>

      <h1 style={{fontSize: '1.3rem'}}>Manifiesto Segun Guia 202 - {codigo} </h1>
      <Button size="sm"  variant="outline"  onClick={() => setIsModalOpen(true)} startIcon={<EditIcon />} children={undefined}>  
      </Button>
      </div>
      
      
      <div>
        <h1 style={{fontSize: '1.3rem'}}>Semana {range} </h1>
      </div>
      <br/>



      
      <div className="space-y-6">
    
              <Button size="sm" onClick={exportToExcel}>
              Descargar Manifiestos
                </Button>
                <PageBreadcrumb pageTitle={`Total: ${peso_Total.toFixed(2)}KG`} />
        <ComponentCard title="Bultos">

          <BultosTable
            openInsert={setIsModalOpen2}
            bultos={bultos}
            delete_id_bulto={delete_id_bulto} />
        </ComponentCard>
        <ComponentCard title="Frios">
          <BasicTableMulti 
          tableData={tableData_frios} 
         
          addBulto={addBulto} 
          addSameBulto={addSameBulto}
          handleAtiende={handleAtiende}
          atiende ={atiende}
          useSameID={useSameID}
          setUseSameID={setUseSameID}/>
        </ComponentCard>
        <ComponentCard title="Secos">
          <BasicTableMulti 
            tableData={tableData_secos} 
            
            addBulto={addBulto} 
            handleAtiende={handleAtiende}
          atiende ={atiende}
            addSameBulto={addSameBulto}
            useSameID={useSameID}
            setUseSameID={setUseSameID} />
        </ComponentCard>
      </div>
    </>
  );
}
