import * as React from 'react';
import styles from './DnTransporterDashboard.module.scss';
import { IDnTransporterDashboardProps } from './IDnTransporterDashboardProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/site-users/web";
import "@pnp/sp/attachments";
import "@pnp/sp/presets/all";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons";
import "datatables.net";
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import * as moment from 'moment';
import 'datatables.net-dt/css/jquery.dataTables.css';
import * as XLSX from 'xlsx';
import { sp } from '@pnp/sp/presets/all';
import Swal from 'sweetalert2'
// import jsPDF from 'jspdf';
// import { sp } from '@pnp/sp';
import { jsPDF } from 'jspdf';
// import * as jsPDF from 'jspdf';  
// import { PnPBatch}  from "@pnp/pnpjs";
// import { SPBatch } from "@pnp/sp/presets/all";
import * as html2pdf from 'html2pdf.js';
import DnBillingDashboard from './DnBillingDASHBOARD';
import { PDFDocument, rgb, StandardFonts, } from 'pdf-lib';

// import { createPdf } from 'html-pdf-parser';

// const fs = require('fs/promises');





let CurrentLoggedinuserID;
let CurrentLoggedinuserEmail: string;
let Items1: string;
let CurrentLoggedinuserName;
let TotalEntries;
let Delivered;
let Pending;
var SelectedId;
var Selecteddnnumber: any;
// var DocumentName: any;
let tabl = null;
var Attachfiles: any[];
var MasterArray: {};
var Transporter_Selected = "-";
// var selectedDate: any;
var responses = [];
var pdfTruckType: string;
var totalCount;
// var currentDate;
var uniqueTruckNumber: any = [];
var detailedUniqueTruckNumbers: any[] = [];
var detailedUnmatchedUniqueTruckNumbers: any[] = [];
var detailedUniqueTruckNumbers_del: any[] = [];
var detailedUnmatchedUniqueTruckNumbers_del: any[] = [];
var DeliveredReportDates = [];
var img;
var transporterList: any[] = [];
var selectedTransporter = '';
var AllData: any[] = [];
var paginationitems = [];
let ItemsPerPage;
let ItemsCount;
let pageCount;
let numbers;
let currentChunkIndex = 0; // Index of the current chunk
let isfirstchunck: string;
let islastchunk: string;
var isAdmin: boolean;

// var currentpage;



// const batch = sp.createBatch();
// var pendingArray = [];
// var deliverArray = [];
SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css`);
SPComponentLoader.loadCss('https://cdn.datatables.net/responsive/2.2.3/css/responsive.bootstrap.min.css');
SPComponentLoader.loadCss('https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css');
SPComponentLoader.loadCss('https://cdn.datatables.net/buttons/1.6.0/css/buttons.dataTables.min.css');
SPComponentLoader.loadScript(`https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js`);
SPComponentLoader.loadScript("https://code.jquery.com/jquery-3.6.0.js");
SPComponentLoader.loadScript("https://code.jquery.com/ui/1.13.1/jquery-ui.js");
SPComponentLoader.loadScript(`https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js`);
SPComponentLoader.loadScript('https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js');
SPComponentLoader.loadScript('https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js');
SPComponentLoader.loadScript('https://cdn.datatables.net/buttons/2.2.2/js/buttons.print.min.js');
SPComponentLoader.loadScript('https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css');
SPComponentLoader.loadScript('https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css');
SPComponentLoader.loadScript('https://cdn.datatables.net/buttons/2.2.2/js/buttons.colVis.min.js');
SPComponentLoader.loadCss('https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/CSS/style.css?v=4.7');
SPComponentLoader.loadCss('https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/CSS/printstyle.css?v=2.1');



export interface IDnTransporterDashboardState {
  Items: any[];
  StampedItem: any[];
  FilteredItem: any[];
  IsEmailpresent: boolean;
  Items1: any[];

  CurrentUserName: any[];
  CurrentUserDesignation: any[];
  CurrentLoggedinuserNameState: any;
  CurrentUserEmail: any;
  TotalEntries: any;
  TotalDelivered: any;
  TotalPending: any;
  TotalInprogress: any;
  TotalRejected: any;

  // CurrentSelectedDate: string;
  startDate: any;
  endDate: any;
  startDateSelected: boolean, // Track if start date is chosen
  endDateSelected: boolean,






  // Data: IDataItem[];
  DataTables_Value: boolean;

  DNFile: string;
  DNFileStatus: string;

  IsSavinginProgress: boolean;
  showProgress: boolean;
  progressLabel: string;
  progressDescription: string;
  progressPercent: number;

  IsDNFileUploadingStatusdone: boolean;
  IsCurrentUserIsAdmin: boolean;
  PDFDeliveredItem: any[],
  // PDFDeliveredItemNonZeroCharge: any[],
  // PDFDeliverUniqueunmatchedItem: any[],
  PDFPendingItem: any[];
  PDFUnmatchedItem: any[],
  PDFUnmatchedItemDeliver: any[],
  // CurrentDateTime_pending: string;
  // CurrentDateTime_deliver: string;
  chargeListPendingItem: any[];
  pendingArrayItem: any[];
  deliverArrayItem: any[];
  // isClickedDetailedItem: boolean;
  isTransporterDashboard: boolean;
  isBillingDashboard: boolean;
  selectedReport: any;
  selectedTransporter: any;
  isClickedpendingDetailedItem: boolean;
  isClickedDeliverDetailedItem: boolean;
  currentPage: any;
  itemsPerPage: any;
  totalItems: any;
  PageCount: number;
  AllItems: any[];
  renderCompleted: boolean;
  filters: any;
  remarks: any;


}
interface IDataItem {
  DeliveryNumber: number;
  TripNumber: string;
  RevisedTripNuber: string;
  Created: string;
  CompanyName: string;
  FromAddress: string;
  ToAddress: string;
  Trucktype: string;
  Trucknumber: string;
  DriverName: string;
  DNDashBoardDeliveryStatus: string;
  Modified: string;
  DNEIDURL: string;
}
interface MyObject {
  FROM_LOC: string;
  TO_LOC: string;
  Title: string;
  CHRG: string;
  // Add other properties as needed
}

interface PendingItem {
  DNDashBoardDeliveryStatus: string;
  Trucknumber: string;
  ToAddress: string;
  FromAddress: string;
  Trucktype: string;
  RevisedTripNuber: string | null;
  // Add more properties as needed
}
// let Newweb = Web("https://balmerlawries.sharepoint.com/sites/DN-Transport/");

let newweb = Web("https://balmerlawries.sharepoint.com/sites/DN-Transport/");
// let NewBackupWeb = Web("https://balmerlawries.sharepoint.com/sites/DN-Transport/DN-Transport-Backup/");
var momentStartDate:any = '';
var momentEndDate:any = '';
var adjustedEndDate:any;
var Remarks:any = {}



export default class DnTransporterDashboard extends React.Component<IDnTransporterDashboardProps, IDnTransporterDashboardState, {}> {
  public constructor(props: IDnTransporterDashboardProps, state: IDnTransporterDashboardState) {
    super(props);
    var selectstartdate = $("#txt-current-date").val();//2023-10
    momentStartDate = moment(selectstartdate).format("YYYY-MM-DD");
    var selectenddate = $("#txt-end-date").val();//2023-10
    momentEndDate = moment(selectenddate).format("YYYY-MM-DD");

    this.state = {

      DNFile: "",
      DNFileStatus: "Pending",
      PDFPendingItem: [],
      PDFUnmatchedItem: [],
      PDFUnmatchedItemDeliver: [],
      PDFDeliveredItem: [],
      // PDFDeliveredItemNonZeroCharge: [],
      // PDFDeliverUniqueunmatchedItem: [],
      IsSavinginProgress: false,
      showProgress: false,
      progressLabel: "File upload in progress",
      progressDescription: "",
      progressPercent: 0,
      // CurrentDateTime_pending: moment().format('DD-MMM-YY HH:mm'),
      // CurrentDateTime_deliver: moment().format('DD-MMM-YY HH:mm'),
      IsDNFileUploadingStatusdone: false,
      pendingArrayItem: [],
      // Data: [],
      DataTables_Value: false,
      TotalEntries: 0,
      TotalDelivered: 0,
      TotalPending: 0,
      TotalInprogress: 0,
      TotalRejected: 0,
      Items: [],
      IsEmailpresent: false,
      Items1: [],
      StampedItem: [],
      FilteredItem: [],
      CurrentUserName: [],
      CurrentUserDesignation: [],
      CurrentLoggedinuserNameState: "",
      CurrentUserEmail: "",
      // CurrentSelectedDate: moment().format("YYYY-MM-DD"),
      // startDate: moment().format('YYYY-MM-DD'), // Set the initial start date
      startDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      startDateSelected: false, // Track if start date is chosen
      endDateSelected: false,
      IsCurrentUserIsAdmin: false,
      chargeListPendingItem: [],
      deliverArrayItem: [],
      // isClickedDetailedItem: false,
      isTransporterDashboard: true,
      isBillingDashboard: false,
      selectedReport: null,
      selectedTransporter: null,
      isClickedpendingDetailedItem: false,
      isClickedDeliverDetailedItem: false,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      PageCount: 0,
      AllItems: [],
      renderCompleted: false,
      filters: {},
      remarks: {},
    }
  }

  public async componentDidMount() {

    $.fn.dataTable.ext.errMode = 'none';
    this.removefile();
    $(".popup_banner").hide();
    $(".popup_div").hide();
    this.getdoc();
  }

  // public fetchWithRetry = async (url: string, retries = 5, backoff = 300): Promise<Response> => {
  //   for (let i = 0; i < retries; i++) {
  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) {
  //         if (response.status === 429) {
  //           const retryAfter = response.headers.get('Retry-After');
  //           const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : backoff * Math.pow(2, i);
  //           await new Promise(resolve => setTimeout(resolve, waitTime));
  //         } else {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }
  //       } else {
  //         return response;
  //       }
  //     } catch (error) {
  //       if (i === retries - 1) throw error;
  //       await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
  //     }
  //   }
  //   throw new Error('Failed to fetch after maximum retries');
  // };

  // public async getdoc() {
  //   try {
  //     const userResponse = await this.fetchWithRetry(`${newweb}/_api/web/currentuser`);
  //     const user = await userResponse.json();

  //     CurrentLoggedinuserID = user.Id;
  //     CurrentLoggedinuserName = user.Title;
  //     CurrentLoggedinuserEmail = user.Email;
  //     console.log(CurrentLoggedinuserEmail);
  //     console.log(CurrentLoggedinuserName);

  //     if (CurrentLoggedinuserEmail != null) {
  //       const groupsResponse = await this.fetchWithRetry(`${newweb}/_api/web/currentuser/groups`);
  //       const groups = await groupsResponse.json();
  //       console.log(groups);

  //       isAdmin = groups.some(group => group.Title === "Transporter Dashboard Admin");
  //       if (isAdmin) {
  //         this.setState({ IsCurrentUserIsAdmin: isAdmin });
  //       }
  //     }

  //     this.setState({ CurrentLoggedinuserNameState: CurrentLoggedinuserName });

  //     $("#loader_icon").show();
  //     $("#Load_content").hide();
  //     $(".Transporter").addClass("active");
  //     $(".Billing").removeClass("active");

  //     await this.Group_Details("defaut_loading");
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }



  public async getdoc() {
    try {
      const user = await this.getCurrentUserWithRetry();
      // debugger;
      CurrentLoggedinuserID = user.Id;
      CurrentLoggedinuserName = user.Title;
      CurrentLoggedinuserEmail = user.Email;
      console.log(CurrentLoggedinuserEmail);
      console.log(CurrentLoggedinuserName);
  
      if (CurrentLoggedinuserEmail) {
        const isAdmin = await this.checkIfAdminWithRetry();
        this.setState({
          IsCurrentUserIsAdmin: isAdmin,
        });
      }
  
      this.setState({ CurrentLoggedinuserNameState: CurrentLoggedinuserName });
  
      // Update UI elements
      $("#loader_icon").show();
      $("#Load_content").hide();
      $(".Transporter").addClass("active");
      $(".Billing").removeClass("active");
  
      // Fetch group details
      await this.Group_Details("default_loading");
    } catch (error) {
      console.error("Error fetching user details or group information:", error);
    }
  }
  
  private async getCurrentUserWithRetry(retries = 3, backoff = 300): Promise<any> {
    try {
      return await newweb.currentUser.get();
    } catch (error) {
      if ((error.status === 429 || error.status === 406) && retries > 0) {
        console.warn(`Throttled request (${error.status}). Retrying... (${3 - retries + 1})`);
        await new Promise(res => setTimeout(res, backoff));
        return this.getCurrentUserWithRetry(retries - 1, backoff * 2); // Retry with exponential backoff
      } else {
        console.error('Error fetching current user:', error);
        throw error;
      }
    }
  }

  
  private async checkIfAdminWithRetry(retries = 3, backoff = 300): Promise<boolean> {
    try {
      const groups = await newweb.currentUser.groups();
      console.log(groups);
      return groups.some(group => group.Title === "Transporter Dashboard Admin");
    } catch (error) {
      if (error.status === 429 && retries > 0) { // 429 is too many requests (throttling)
        await new Promise(res => setTimeout(res, backoff));
        return this.checkIfAdminWithRetry(retries - 1, backoff * 2); // Retry with exponential backoff
      } else {
        console.error('Error fetching user groups:', error);
        throw error;
      }
    }
  }
  
  

  // public async getdoc() {
  //   try {
  //     const currentUserUrl = `${sp.web.url}/_api/web/currentuser`;
  //     const userResponse = await this.fetchWithRetry(currentUserUrl);
  //     const user = await userResponse.json();

  //     CurrentLoggedinuserID = user.Id;
  //     CurrentLoggedinuserName = user.Title;
  //     CurrentLoggedinuserEmail = user.Email;
  //     console.log(CurrentLoggedinuserEmail);
  //     console.log(CurrentLoggedinuserName);

  //     if (CurrentLoggedinuserEmail != null) {
  //       const groupsResponse = await fetchWithRetry(`${sp.web.url}/_api/web/currentuser/groups`);
  //       const groups = await groupsResponse.json();
  //       console.log(groups);

  //       isAdmin = groups.some(group => group.Title === "Transporter Dashboard Admin");
  //       if (isAdmin) {
  //         this.setState({ IsCurrentUserIsAdmin: isAdmin });
  //       }
  //     }

  //     this.setState({ CurrentLoggedinuserNameState: CurrentLoggedinuserName });

  //     $("#loader_icon").show();
  //     $("#Load_content").hide();
  //     $(".Transporter").addClass("active");
  //     $(".Billing").removeClass("active");

  //     await this.Group_Details("defaut_loading");
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }

  public GetCurrentUserDetails() {
    var reacthandler = this;
    $.ajax({
      url: `${reacthandler.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        var email = resultData.d.Email;
        var Name = resultData.d.DisplayName;
        var Designation = resultData.d.Title;
        reacthandler.setState({
          CurrentUserName: Name,
          CurrentUserDesignation: Designation,
          // CurrentUserProfilePic: `${reacthandler.props.siteurl}/_layouts/15/userphoto.aspx?size=l&username=${email}`
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  public async GetAllTransporterDetails() {
    const getItemsWithRetry:any = async (retries = 3, backoff = 300) => {
      try {
        const response = await newweb.lists.getByTitle("Delivery Note Transactions").items
          .select("TransporterName", "ID")
          .top(5000) // Adjust the top value as needed
          .get();
          
        if (response.length !== 0) {
          AllData = response;
        }
      } catch (error) {
        if (error.status === 429 && retries > 0) { // 429 is too many requests (throttling)
          await new Promise(res => setTimeout(res, backoff));
          return getItemsWithRetry(retries - 1, backoff * 2); // Retry with exponential backoff
        } else {
          console.error('Error fetching transporter details:', error);
          throw error;
        }
      }
    };
  
    await getItemsWithRetry();
  }
  
  public async Group_Details(Mode: string) {
    try {
      await this.Getsessionstorageitems();
      const table = $("#DNTable").DataTable();
      if (table) {
        table.destroy();
      }
  
      // Retrieve data based on user role
      if (CurrentLoggedinuserEmail !== null) {
        if (isAdmin) {
          await this.getItemsAndTotalCount("DNTransporterNotPresent");
        } else {
          const result = await this.getTransporterDetailsWithRetry(CurrentLoggedinuserEmail);
          if (result && result.length > 0) {
            Items1 = result[0].Title;
            Transporter_Selected = result[0].Title;
            await this.getItemsAndTotalCount("DNTransporterPresent");
          } else {
            console.warn("No items found for the current user email.");
          }
        }
      } else {
        console.warn("CurrentLoggedinuserEmail is null.");
      }
    } catch (error) {
      console.error("Error in Group_Details:", error);
    } finally {
      // Hide loader regardless of success or error
      this.hideLoader();
    }
  }
  
  private async getTransporterDetailsWithRetry(email: string, retries = 3, backoff = 300): Promise<any> {
    try {
      return await newweb.lists.getByTitle("DN Transporter Details Master").items
        .select("Title", "Email")
        .filter(`Email eq '${email}'`)
        .get();
    } catch (error) {
      if ((error.status === 429 || error.status === 406) && retries > 0) { // Handle 429 and 406 errors
        await new Promise(res => setTimeout(res, backoff));
        return this.getTransporterDetailsWithRetry(email, retries - 1, backoff * 2); // Retry with exponential backoff
      } else {
        console.error('Error fetching transporter details:', error);
        throw error;
      }
    }
  }

  // public async getItemsAndTotalCount(modetype: string) {
  //   try {
  //     let filter = '';
  //     // Apply additional filter based on modetype
  //     if (modetype === "DNTransporterPresent") {
  //       filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DNDashBoardDeliveryStatus ne 'Cancelled' and DNDashBoardDeliveryStatus ne 'Not Applicable' and DNDashBoardDeliveryStatus ne null`;
  //       // filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DNDashBoardDeliveryStatus ne 'Cancelled' and DNDashBoardDeliveryStatus ne 'Not Applicable' and DNDashBoardDeliveryStatus ne null`;
  //     } else {
  //       if (selectedTransporter === '') {
  //         await this.GetAllTransporterDetails();
  //         const transporterNameList = AllData.map(item => ({
  //           id: item.ID,
  //           name: item.TransporterName
  //         }));
  //         // Removing duplicates based on 'name' property
  //         const uniqueTransporterList = transporterNameList
  //           .filter(transporter => transporter.name !== null)
  //           .filter((transporter, index, self) =>
  //             index === self.findIndex(t => t.name === transporter.name)
  //           );
  //         transporterList = uniqueTransporterList;
  //         // console.log(transporterList[0]);
  //         Items1 = transporterList[0].name;
  //         Transporter_Selected = Items1;
  //         selectedTransporter = Items1;
  //         console.log("itesmupdated1");
  //       }
  //       filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DNDashBoardDeliveryStatus ne 'Cancelled' and DNDashBoardDeliveryStatus ne 'Not Applicable' and DNDashBoardDeliveryStatus ne null`;

  //     }

  //     let allItems: any[] = [];
  //     // Fetch the first batch of items
  //     let items = await newweb.lists.getByTitle("Delivery Note Transactions").items
  //       .select(
  //         "DeliveryNumber",
  //         "TripNumber",
  //         "Created",
  //         "CustomerName",
  //         "FromAddress",
  //         "ToAddress",
  //         "Trucktype",
  //         "Trucknumber",
  //         "DriverName",
  //         "DNDashBoardDeliveryStatus",
  //         "BillingStatus",
  //         "Modified",
  //         "DriverMobileNumber",
  //         "CompanyName",
  //         "Customercontactnumber",
  //         "TransporterName",
  //         "DNEIDURL",
  //         "RevisedTripNuber",
  //         "ActualCreatedDateTime",
  //         "ActualCreatedDatewithTime",
  //         "ActualModifiedDateTime",
  //         "ID",
  //         "Remarks"
  //       )
  //       .filter(filter)
  //       .top(5000)
  //       .getPaged();

  //     // Concatenate the results of the first batch
  //     allItems = allItems.concat(items.results);

  //     // Continue fetching next batches while there are more items
  //     while (items.hasNext) {
  //       items = await items.getNext();
  //       allItems = allItems.concat(items.results);
  //     }

  //     if (allItems.length !== 0) {
  //       let DeliveredData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Delivered").length;
  //       let PendingData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Pending").length;
  //       let InprogressData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Inprogress").length;
  //       let RejectedData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Rejected").length;
  //       let totalEntries = allItems.length;
  //       await this.setState({
  //         TotalEntries: totalEntries,
  //         TotalDelivered: DeliveredData,
  //         TotalPending: PendingData,
  //         TotalInprogress: InprogressData,
  //         TotalRejected: RejectedData,
  //         Items: allItems,
  //         selectedTransporter: Items1,
  //       }, () => {
  //         this.load_data_tables();
  //       })
  //     } else {
  //       this.showErrorMessage('No DN Available');
  //       this.setState({
  //         TotalEntries: 0,
  //         TotalDelivered: 0,
  //         TotalPending: 0,
  //         TotalInprogress: 0,
  //         TotalRejected: 0,
  //         Items: [],
  //         selectedTransporter: Items1,
  //       }, () => {
  //         this.load_data_tables();
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     this.hideLoader();
  //   }
  // }

  public async getItemsAndTotalCount(modetype: string) {
    try {
      let filter = '';
      // Apply additional filter based on modetype
      if (modetype === "DNTransporterPresent") {
        filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DNDashBoardDeliveryStatus ne 'Cancelled' and DNDashBoardDeliveryStatus ne 'Not Applicable' and DNDashBoardDeliveryStatus ne null`;
      } else {
        if (selectedTransporter === '') {
          await this.GetAllTransporterDetails();
          const transporterNameList = AllData.map(item => ({
            id: item.ID,
            name: item.TransporterName
          }));
          // Removing duplicates based on 'name' property
          const uniqueTransporterList = transporterNameList
            .filter(transporter => transporter.name !== null)
            .filter((transporter, index, self) =>
              index === self.findIndex(t => t.name === transporter.name)
            );
          transporterList = uniqueTransporterList;
          Items1 = transporterList[0].name;
          Transporter_Selected = Items1;
          selectedTransporter = Items1;
          console.log("items updated");
        }
        filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DNDashBoardDeliveryStatus ne 'Cancelled' and DNDashBoardDeliveryStatus ne 'Not Applicable' and DNDashBoardDeliveryStatus ne null`;
      }
  
      let allItems: any[] = [];
      let items = await this.getItemsWithRetry(filter);
  
      // Concatenate the results of the first batch
      allItems = allItems.concat(items.results);
  
      // Continue fetching next batches while there are more items
      while (items.hasNext) {
        items = await this.getNextItemsWithRetry(items);
        allItems = allItems.concat(items.results);
      }
  
      if (allItems.length !== 0) {
        let DeliveredData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Delivered").length;
        let PendingData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Pending").length;
        let InprogressData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Inprogress").length;
        let RejectedData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Rejected").length;
        let totalEntries = allItems.length;
        await this.setState({
          TotalEntries: totalEntries,
          TotalDelivered: DeliveredData,
          TotalPending: PendingData,
          TotalInprogress: InprogressData,
          TotalRejected: RejectedData,
          Items: allItems,
          selectedTransporter: Items1,
        }, () => {
          this.load_data_tables();
        });
      } else {
        this.showErrorMessage('No DN Available');
        this.setState({
          TotalEntries: 0,
          TotalDelivered: 0,
          TotalPending: 0,
          TotalInprogress: 0,
          TotalRejected: 0,
          Items: [],
          selectedTransporter: Items1,
        }, () => {
          this.load_data_tables();
        });
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.hideLoader();
    }
  }
  
  private async getItemsWithRetry(filter: string, retries = 3, backoff = 300): Promise<any> {
    try {
      return await newweb.lists.getByTitle("Delivery Note Transactions").items
        .select(
          "DeliveryNumber",
          "TripNumber",
          "Created",
          "CustomerName",
          "FromAddress",
          "ToAddress",
          "Trucktype",
          "Trucknumber",
          "DriverName",
          "DNDashBoardDeliveryStatus",
          "BillingStatus",
          "Modified",
          "DriverMobileNumber",
          "CompanyName",
          "Customercontactnumber",
          "TransporterName",
          "DNEIDURL",
          "RevisedTripNuber",
          "ActualCreatedDateTime",
          "ActualCreatedDatewithTime",
          "ActualModifiedDateTime",
          "ID",
          "Remarks"
        )
        .filter(filter)
        .top(5000)
        .getPaged();
    } catch (error) {
      if ((error.status === 429 || error.status === 406) && retries > 0) {
        // Log the retry attempt
        console.warn(`Throttled request. Retrying... (${3 - retries + 1})`);
        
        await new Promise(res => setTimeout(res, backoff));
        return this.getItemsWithRetry(filter, retries - 1, backoff * 2); // Retry with exponential backoff
      } else {
        console.error('Error fetching items:', error);
        throw error;
      }
    }
  }
  
  
  private async getNextItemsWithRetry(items: any, retries = 3, backoff = 300): Promise<any> {
    try {
      return await items.getNext();
    } catch (error) {
      if (error.status === 429 && retries > 0) { // 429 is too many requests (throttling)
        await new Promise(res => setTimeout(res, backoff));
        return this.getNextItemsWithRetry(items, retries - 1, backoff * 2); // Retry with exponential backoff
      } else if (error.status === 406 && retries > 0) { // Handle 406 errors similarly
        await new Promise(res => setTimeout(res, backoff));
        return this.getNextItemsWithRetry(items, retries - 1, backoff * 2); // Retry with exponential backoff
      } else {
        console.error('Error fetching next batch of items:', error);
        throw error;
      }
    }
  }
  
  public showLoader() {
    $("#Load_content").hide();
    $("#loader_icon").show();
  }

  public hideLoader() {
    setTimeout(() => {
      $("#loader_icon").hide();
      $("#Load_content").show();
    }, 1000);

  }

  public Getsessionstorageitems() {
    const submitButtonClicked = sessionStorage.getItem('submitButtonClicked');
    if (submitButtonClicked == 'true') {
      const startDate = sessionStorage.getItem('startDate');
      const endDate = sessionStorage.getItem('endDate');
      const Transporter = sessionStorage.getItem('Transporter');
      const transporterListString = sessionStorage.getItem('Transporterlist');
      if (transporterListString) {
        let transporterListitems = JSON.parse(transporterListString);
        transporterList = transporterListitems
        // Now you can use the transporterList array
      };
      selectedTransporter = Transporter;
      Items1 = selectedTransporter;
      Transporter_Selected = Items1;
      if (startDate && endDate) {
        this.setState({
          startDate,
          endDate,
          startDateSelected: true,
          // selectedTransporter: Items1,
        }, () => {
          // Clear session storage after use
          sessionStorage.removeItem('startDate');
          sessionStorage.removeItem('endDate');
          sessionStorage.removeItem('Transporter');
          sessionStorage.removeItem('Transporterlist');
          sessionStorage.removeItem('submitButtonClicked');
        });
      }

    } else {
      return;
    }
  }

  public async getFilteredItems() {
    const table = ($('.my-dntable') as any).DataTable();
    // table.draw();
    const filters: string[] = [];
    let filteredItems = [];
    // Collect filter conditions from DataTable
    table.columns().every(function () {
      if (this.search() !== '') {
        const columnId = this.header().id;
        // const filterValue = this.search().trim();
        const filterValue = this.search().trim().replace(/^\^|\$$/g, '').replace(/\\-/g, '-');
        const filterString = `${columnId} eq '${filterValue}'`;
        filters.push(filterString);
      }
    })
    if (filters.length != 0) {
      filteredItems = this.state.Items.filter(item => {
        return filters.every(filter => {
          const [columnId, filterValue] = filter.split(" eq ");
          return item[columnId] === filterValue.replace(/'/g, '');
        });
      });
    } else {
      filteredItems = this.state.Items;
    }
    this.setState({
      FilteredItem: filteredItems,
    })

  }


  public exportToExcel = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const wb = XLSX.utils.book_new();
    var wsData = [];
    var searchValue: any = $('#DNTable_filter input').val();
    // Get filtered items
    if (searchValue != "") {
      // Get the DataTable data
      const table = ($('.my-dntable') as any).DataTable();
      table.draw();
      function extractRemarks(html: string) {
        const div = document.createElement('div');
        div.innerHTML = html;
        // Get the text content from the remarks text div
        const remarksText = div.querySelector('.remarks_text').textContent;
        return remarksText && remarksText.trim() ? remarksText.trim() : '-';
        // return remarksText.trim(); // Remove any leading or trailing whitespace
      }
      var dtData = table.rows({ search: 'applied' }).data().toArray();
      wsData = [
        ['DN Number', 'Trip Number', 'RevisedTripNuber', 'Date', 'Customer Name', 'From Location', 'To Location', 'Truck Type', 'Truck Number', 'Driver Name', 'Status', 'Completion Date', "Stamped DN", "Remarks"], // Excel header row
        ...dtData.map((Items: any[]) => [
          Items[0], Items[1], Items[2], Items[3], Items[4],
          Items[5], Items[6], Items[7], Items[8], Items[9],
          Items[10], Items[11], Items[12], extractRemarks(Items[14])
        ]),
      ];
    } else {
      await this.getFilteredItems();
      // const wb = XLSX.utils.book_new();
      wsData = [
        ['DN Number', 'Trip Number', 'RevisedTripNuber', 'Date', 'Customer Name', 'From Location', 'To Location', 'Truck Type', 'Truck Number', 'Driver Name', 'Status', 'Completion Date', 'Stamped DN', 'Remarks'], // Excel header row
        ...this.state.FilteredItem.map(Items => [
          Items.DeliveryNumber,
          Items.TripNumber,
          Items.RevisedTripNuber,
          Items.ActualCreatedDatewithTime,
          Items.CompanyName,
          Items.FromAddress,
          Items.ToAddress,
          Items.Trucktype,
          Items.Trucknumber,
          Items.DriverName,
          Items.DNDashBoardDeliveryStatus,
          Items.DNDashBoardDeliveryStatus.toLowerCase() !== "pending" ? moment(Items.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm") : "-", // Conditionally include completion date
          Items.DNEIDURL !== null ? Items.DNEIDURL.Url : "-", // If no URL provided, display a dash
          Items.Remarks !== null ? Items.Remarks : "-" // If no URL provided, display a dash
        ]),
      ];
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  };





  handleStartDateChange = (event: { target: { value: any; }; }) => {
    var newStartDate = event.target.value;
    momentStartDate = moment(newStartDate).format("YYYY-MM-DD");

    this.setState({
      startDate: moment(momentStartDate).format('YYYY-MM-DD'),
      startDateSelected: true,
    })
  };

  handleEndDateChange = (event: { target: { value: any; }; }) => {
    var newEndDate = event.target.value;//2023-10
    momentEndDate = moment(newEndDate).format("YYYY-MM-DD");
    adjustedEndDate = moment(momentEndDate).endOf('day');

    this.setState({
      endDate: moment(adjustedEndDate).format('YYYY-MM-DD'),
      endDateSelected: true,
    })
  };

  Submitdates = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { startDateSelected, endDateSelected, startDate, endDate } = this.state;
    if (startDateSelected) {
      const diffInDays = moment(endDate).diff(moment(startDate), 'days');
      if (diffInDays > 15) {
        this.showErrorMessage("Please select a date range within 15 days.");
        return;
      }

      // Save startDate and endDate to session storage
      sessionStorage.setItem('startDate', startDate);
      sessionStorage.setItem('endDate', endDate);
      sessionStorage.setItem('Transporter', Items1);
      sessionStorage.setItem('Transporterlist', JSON.stringify(transporterList));
      sessionStorage.setItem('submitButtonClicked', 'true');
      window.location.reload();
    } else {
      let errorMessage = "";
      if (!startDateSelected) {
        errorMessage = "Kindly select From Date";
      }
      this.showErrorMessage(errorMessage);
    }
  }

  public async destroy_data_table() {
    await this.waitForRenderCompletionDatatable(async () => {
      var existingTable = $('.my-dntable').DataTable();
      if (existingTable) {
        if (this.state.Items.length > 500) {
          await existingTable.destroy();
        } else {
          await existingTable.destroy();
        }
      }
    }, 5000);
  }


  public async getItemsAndTotalCount1() {
    this.showLoader();
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to allow other tasks to run
    await this.destroy_data_table();
    try {
      let filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DNDashBoardDeliveryStatus ne 'Cancelled' and DNDashBoardDeliveryStatus ne 'Not Applicable' and DNDashBoardDeliveryStatus ne null`;
      // Initialize an empty array to store all items
      let allItems: any[] = [];
      // Fetch the first batch of items
      let items = await newweb.lists.getByTitle("Delivery Note Transactions").items
        .select(
          "DeliveryNumber",
          "TripNumber",
          "Created",
          "CustomerName",
          "FromAddress",
          "ToAddress",
          "Trucktype",
          "Trucknumber",
          "DriverName",
          "DNDashBoardDeliveryStatus",
          "BillingStatus",
          "Modified",
          "DriverMobileNumber",
          "CompanyName",
          "Customercontactnumber",
          "TransporterName",
          "DNEIDURL",
          "RevisedTripNuber",
          "ActualCreatedDateTime",
          "ActualCreatedDatewithTime",
          "ActualModifiedDateTime",
          "ID",
          "Remarks"
        )
        .filter(filter)
        .top(5000)
        .getPaged();
      // Concatenate the results of the first batch
      allItems = allItems.concat(items.results);
      // Continue fetching next batches while there are more items
      while (items.hasNext) {
        items = await items.getNext();
        allItems = allItems.concat(items.results);
      }

      if (allItems.length !== 0) {
        let DeliveredData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Delivered").length;
        let PendingData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Pending").length;
        let InprogressData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Inprogress").length;
        let RejectedData = allItems.filter(item => item.DNDashBoardDeliveryStatus === "Rejected").length;
        let totalEntries = allItems.length;
        const tableElement = $('.my-dntable');
        await this.setState({
          TotalEntries: totalEntries,
          TotalDelivered: DeliveredData,
          TotalPending: PendingData,
          TotalInprogress: InprogressData,
          TotalRejected: RejectedData,
          Items: allItems,
          selectedTransporter: Items1,
        })
      } else {
        this.showErrorMessage('No DN Available');
        $('#DNTable').DataTable().destroy();
        this.setState({
          TotalEntries: 0,
          TotalDelivered: 0,
          TotalPending: 0,
          TotalInprogress: 0,
          TotalRejected: 0,
          Items: [],
          selectedTransporter: Items1,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.load_data_tables();
      this.hideLoader();
    }
  }


  handleInputChange = (e: any, key: number, remarktext: any) => {
    // debugger;
    const value:any = e.target.innerText.trim();
    if (value == remarktext) {
      Remarks[key] = value;
      if (value != "") {
        $(`.remarks_tooltip_${key}`).text(value);
        $(`.remark_btn-${key}`).show();
      }
    } else {
      Remarks[key] = value;
      if (value != "") {
        $(`.remarks_tooltip_${key}`).text(value);
        $(`.remark_btn-${key}`).show();
      }
    }

  }
  handleRemarksEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, itemId: any, key: number) => {
    e.preventDefault();
    $(`.txt_remarks-${key}`).attr('contentEditable', 'true').focus();
    $(`.remark_td-${key}`).removeClass("remarks_view");
    $(`.remark_btn-${key}`).show();

    // $(`.remarks_tooltip_${key}`).hide();
  }

  handleRemarksSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, itemId: number, key: number, DOMID: string, remarktext: any) => {
    e.preventDefault();
    // if(Remarks[key] == undefined ? remarktext : Remarks[key])
    // const remark = Remarks[key] === undefined ? remarktext : (Remarks[key] || remarktext);
    if (Remarks[key] == undefined) {
      Remarks[key] = remarktext;
      const remark = Remarks[key] || "";
      this.Successalert('Remarks Added Successfully');
      if (remark != "") {
        $(`.remark_td-${key}`).addClass("remarks_view");
        $(`.txt_remarks-${key}`).attr('contentEditable', 'false').focus();
      }
      else {
        $(`.remark_td-${key}`).removeClass("remarks_view");
        $(`.txt_remarks-${key}`).attr('contentEditable', 'true').focus();
      }
      $(`.txt_remarks-${key}`).attr('contentEditable', 'true').focus();
      $(`.remark_btn-${key}`).hide();
    } else {
      const remark = Remarks[key] || "";
      newweb.lists.getByTitle("Delivery Note Transactions").items.getById(itemId).update({
        Remarks: remark
      }).then(() => {
        this.Successalert('Remarks Added Successfully');
        if (remark != "") {
          $(`.remark_td-${key}`).addClass("remarks_view");
          $(`.txt_remarks-${key}`).attr('contentEditable', 'false').focus();
        }
        else {
          $(`.remark_td-${key}`).removeClass("remarks_view");
          $(`.txt_remarks-${key}`).attr('contentEditable', 'true').focus();
        }
        $(`.txt_remarks-${key}`).attr('contentEditable', 'true').focus();
        $(`.remark_btn-${key}`).hide();
      }).catch(error => {
        console.error("Error updating remark:", error);
      });
    }

  }



  handleRemarksDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, itemId: number, key: number) => {
    e.preventDefault();
    $(`#remarks-${key}`).text(''); // Clear the contentEditable div
    $(`.txt_remarks-${key}`).text(''); // Clear the tooltip paragraph if it shares the same key class
    $(`.remarks_tooltip_${key}`).text('');
    Remarks[key] = "";
    $(`.remark_td-${key}`).removeClass("remarks_view");
    newweb.lists.getByTitle("Delivery Note Transactions").items.getById(itemId).update({
      Remarks: ""
    }).then(() => {
      this.Successalert('Remarks Deleted Successfully');
      $(`.txt_remarks-${key}`).attr('contentEditable', 'true').focus();
    })
  }




  public showErrorMessage(message: string) {
    Swal.fire({
      iconHtml: '<img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/delete_img%202.svg" class="error-img-class">',
      title: message,
      icon: 'error',
      allowOutsideClick: false,
      // timer: 3000,
      showConfirmButton: true,
      customClass: {
        title: 'upload_error_title', // Class for title
        popup: 'swal_delete', // Class for the overall modal
        confirmButton: 'My_btn' // Clas
      }
    });
  }

  public async checkAdminStatus(userEmail: any) {
    const web = Web(this.props.siteurl);
    let adminEmails: string | any[] = [];
    try {
      // Retrieve the Transporter Dashboard Admin group
      const adminGroup = await web.siteGroups.getByName("Transporter Dashboard Admin");
      const users = await adminGroup.users();
      adminEmails = await users.map(user => user.Email);
    } catch (error) {
      // Handle errors, such as if the group or users couldn't be retrieved
      console.error("Error retrieving emails from admin group:", error);
    }
    return adminEmails.includes(userEmail);
  }





  private signOut() {
    $(".SignOut-li").toggle();
  }
  public storeCurrentFilters = () => {
    const table = ($('.my-dntable') as any).DataTable();
    const filters:any = {};
    table.columns().every(function () {
      if (this.search()) {
        filters[this.index()] = this.search();
      }
    });
    this.setState({ filters });
  }

  public load_data_tables() {
    $('.my-dntable').DataTable({
      pageLength: 100,
      lengthMenu: [[5, 10, 20, 50, 100, -1], [5, 10, 20, 50, 100, "All"]],
      language: {
        "zeroRecords": "No data available",
        "emptyTable": "No data available",
        "searchPlaceholder": "Search here...",
        "search": "",
      },
      columnDefs: [
        { targets: '_all', orderable: false } // Disable sorting for all columns
      ],
      initComplete: function () {
        var table = this.api();
        // Iterate over each column
        table.columns().every(function () {
          var column = this;
          var header = $(column.header());
          // Create a select dropdown for each column
          var select = $('<select class="form-control"><option value="">All</option></select>')
            .appendTo(header)
            .on('change', function () {
              var val = $.fn.dataTable.util.escapeRegex($(this).val() as any);
              column.search(val ? '^' + val + '$' : '', true, false).draw();
            });
          // Add options to the select dropdown
          column.data().unique().sort().each(function (d: string, j: any) {
            select.append('<option value="' + d + '">' + d + '</option>')
          });
          // Add a class to the select dropdown for styling purposes
          select.addClass('column-filter');
          // Hide the original column header text
          header.children().not('select').hide();
        });
      }
    });
    $('.my-dntable thead .column-filter').css({
      'width': '100%', // Adjust as needed
      'border-radius': '4px', // Optional styling
      'padding': '5px' // Optional styling
    });
  }

  public closepopup(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.preventDefault();
    $(".popup_banner").removeClass("open");
    $("#uploadfilesdata").val('');
    $(".myFilefile-block").remove();
    $(".image-upload1").show();
  }

  public async Uploadfile(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, Mode: string, itemID: string, DnNumber: string) {
    $(".popup_banner").addClass("open");
    $(".popup_div").show();
    event.preventDefault();
    if (Mode == "Attached") {
      SelectedId = itemID
      Selecteddnnumber = DnNumber
    }
    if (Mode == "Submitted") {
      this.Upload_files_(event, itemID, Selecteddnnumber)
    }
  }

  public async Upload_files_(e: any, itemID: any, DnNumberArg: any) {
    const fileInput = document.querySelector("#uploadfilesdata") as HTMLInputElement;
    const fileArray = fileInput.files;
    if (fileArray.length === 0) {
      this.showErrorMessage('Please Attach a File');
      return;
    }
    const fileValue = fileArray[0];
    // Check if the uploaded file is not a PDF
    if (!fileValue.type.match('application/pdf')) {
      // Check if the file is an image (JPEG or JPG)
      if (fileValue.type.match('image/jpeg') || fileValue.type.match('image/jpg')) {
        // Convert JPEG/JPG to PDF and upload
        this.convertToPdfAndUpload(e, fileValue, DnNumberArg);
      } else {
        Swal.fire({
          iconHtml: '<img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/delete_img%202.svg" class="error-img-class">', // Replace "path_to_your_image" with the actual path to your image
          title: 'File Format Not Supported',
          text: 'Please upload PDF, JPEG, or JPG files only.',
          icon: 'error',
          allowOutsideClick: false,
          showConfirmButton: true,
          customClass: {
            title: 'upload_error_title', // Class for title
            content: 'upload_error_content', // Class for text
            popup: 'swal_delete',// Class for the overall modal
            confirmButton: 'My_btn' // Clas
          }
        });
      }
    } else {
      // Upload PDF directly
      await this.uploadPdfToDocumentLibrary(e, fileValue, DnNumberArg);
    }
  }

  public convertToPdfAndUpload(e: any, file: Blob, DnNumberArg: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      // Create a hidden img element to load the JPEG image
      const img = new Image();
      img.src = imageData as string;
      img.onload = async () => {
        // Create a canvas element to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // Create a new jsPDF instance
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'l' : 'p', // Landscape or portrait based on image dimensions
          unit: 'pt', // Set unit as point (can be adjusted as needed)
          format: [img.width, img.height] // Set PDF format based on image dimensions
        });
        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        // Add image data to the PDF
        pdf.addImage(imageDataUrl, 'JPEG', 0, 0, img.width, img.height);
        // Convert the PDF to a blob
        const pdfBlob = pdf.output('blob');
        // Upload the PDF blob to SharePoint document library using PnPjs
        await this.uploadPdfToDocumentLibrary(e, pdfBlob, DnNumberArg);
      };
    };

    reader.readAsDataURL(file);
  }

  public async uploadPdfToDocumentLibrary(e: any, pdfBlob: Blob, fileName: any) {
    this.closepopup(e);
    this.removefile()
    this.pleasewaitalert('Uploading');
    const signedTempCopiesFolderUrl = `${this.props.context.pageContext.web.serverRelativeUrl}/DN%20Signed%20Temp%20Copies`;
    try {
      let data;
      if (pdfBlob.size <= 3400000) {
        data = await sp.web.getFolderByServerRelativeUrl(signedTempCopiesFolderUrl).files.add(`${fileName}.pdf`, pdfBlob, true);
      } else {
        data = await sp.web.getFolderByServerRelativeUrl(signedTempCopiesFolderUrl).files.addChunked(`${fileName}.pdf`, pdfBlob);
      }
      const item = await data.file.getItem();
      await item.update({
        DNNumber: fileName,
        // Status: "Inprogress"
      }).then(async () => {
        const items = await newweb.lists.getByTitle("Delivery Note Transactions").items
          .select(
            "DeliveryNumber",
            "DNDashBoardDeliveryStatus",
            "ID"
          )
          .filter(`DeliveryNumber eq '${fileName}'`)
          .top(5000)
          .get();
        // Update the delivery status to "Inprogress" for the matching items
        await items.map(item => {
          newweb.lists.getByTitle("Delivery Note Transactions").items.getById(item.ID).update({
            DNDashBoardDeliveryStatus: "Inprogress"
          })
        })
        const newState:any = {
          deliverArrayItem: [],
          pendingArrayItem: [],
          PDFDeliveredItem: [],
          PDFPendingItem: [],
          PDFUnmatchedItemDeliver: [],
        };
        this.setState(newState, () => {
          var searchValue: any = $('#DNTable_filter input').val();
          this.Successalert('Uploaded Successfully');
          setTimeout(async () => {
            // await this.Group_Details("Selection_of_transporter");
            await this.getItemsAndTotalCount1();
            $('#DNTable_filter input').val(searchValue);
            $('#DNTable').DataTable().search(searchValue).draw();
          }, 1500);
        });

      })

    } catch (error) {
      console.error(error, "upload_document");
    }
  }



  public removefile() {
    $(document).on("click", ".my_file_delete", function (event) {
      $("#uploadfilesdata").val("")
      Attachfiles = [];
      let name = $(this).parent().parent().find('span.myFileaname').text();
      $(this).parent().parent().remove();
      $(".image-upload1").show()
    })
  }
  public handleFiles = (e: any) => {
    var fileValue: any = (document.querySelector("#uploadfilesdata") as HTMLInputElement).files[0];
    const files:any = e.target.files || e.dataTransfer.files;
    Attachfiles = []
    let fileBloc = $('<li/>',
      {
        class: 'myFilefile-block'
      }),
      fileName = $('<span/>',
        {
          class: 'myFileaname', text: fileValue.name
        });
    fileBloc.append(fileName).append(`<span class="file-delete3"><span class="my_file_delete">
  <img class="img_cross" style="width:10px" src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/close.svg" alt="error"></span></span>`);
    $(`#attachdnfile`).append(fileBloc);
    $(".image-upload1").hide()
  }

  handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    var files:any = event.dataTransfer.files
    Attachfiles = files
    if (files.length != 0) {
      for (var i = 0; i < files.length; i++) {
        let fileBloc = $('<li/>',
          {
            class: 'myFilefile-block'
          }),
          fileName = $('<span/>',
            {
              class: 'myFileaname', text: files[i].name
            });
        fileBloc.append(fileName).append(`<span class="file-delete3"><span class="my_file_delete">
    <img class="img_cross" style="width:10px" src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/close.svg" alt="error"></span></span>`);
        $(`#attachdnfile`).append(fileBloc);
        $(".image-upload1").hide();

      }
    }
  }

  handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }


  // Assuming the code you provided is wrapped in a function or an event handler
  public pendingPDF = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    var mathcedItems = this.state.PDFPendingItem.length;
    var unmathcedItems = this.state.PDFUnmatchedItem.length;
    if (mathcedItems != 0 || unmathcedItems != 0) {
      $("#pdf-margin").show();
      $(".pendingPdf").show();
      try {
        await this.waitForRenderCompletion(async () => {
          var he_Hights = document.getElementById("header");
          var hight = he_Hights.offsetHeight;
          var page_Hights = document.getElementById("pendingPdf");
          var hight_page = page_Hights.offsetHeight;
          var pdfjs = document.querySelector("#pendingPdf") as HTMLElement;
          if (!pdfjs) {
            throw new Error("Element with ID 'pendingPdf' not found");
          }
          const options = {
            filename: `requestor.pdf`,
            fontSize: "12px",
            margin: [5, 5],
            image: { type: 'jpeg', quality: 1 },
            // format: [200, 350],
            html2canvas: { dpi: 400, letterRendering: true, useCORS: true, scale: 3 },
            pagebreak: { mode: ['css'] },
            jsPDF: {
              unit: 'mm',
              // format: 'a4', 
              format: [290, 370],
              orientation: 'portrait',
            },
            header: (currentPage: any, pageCount: any, pdf: any) => {
              return {
                // text: `Header on Page ${currentPage} of ${pageCount}`, // You can customize the header text
                text: 'Header on Page new page', // You can customize the header text
                style: 'headerStyle', // You can define a CSS class for styling
              };
            },
          };

          // Generate the PDF using html2pdf library
          const blob = await html2pdf().set(options).from(pdfjs).toPdf().output('blob');
          // const blob = await html2pdf().set(options).from(pdfjs).toPdf().output('blob');
          const file = new File([blob], 'requestor.pdf', { type: blob.type });
          // Create a link element
          const link = document.createElement('a');
          // Set the href attribute to a URL created from the Blob
          link.href = URL.createObjectURL(file);
          link.download = `Exception-Report- ${moment().format('DD-MM-YYYY')}.pdf`;
          this.Successalert('PDF Downloaded successfully!');
          // Append the link to the document
          document.body.appendChild(link);
          // Trigger a click on the link to start the download
          link.click();
        }, 5000);

      } catch (error) {
        console.error("Error generating or downloading PDF:", error);
      }
      $("#pdf-margin").hide();
      $(".pendingPdf").hide();
    }
    else {
      this.showErrorMessage('No Pending DN Available for Download');
    }
  };
  public addPrintStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        table {
          page-break-inside: avoid;
        }
        tr {
          break-inside: avoid;
        }
        tbody {
          display: block;
        }
      }
    `;
    document.head.appendChild(style);
  }


  //working
  public pendingDetailedPDF = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    var mathcedItems = this.state.PDFPendingItem.length;
    var unmathcedItems = this.state.PDFUnmatchedItem.length;
    // console.log(mathcedItems, unmathcedItems);
    var scalevalue;
    if (mathcedItems !== 0 || unmathcedItems !== 0) {
      $("#pdf-margin").show();
      $(".pendingPdf-details").show();

      try {
        await this.waitForRenderCompletion(async () => {
          const pdfElement = document.getElementById("pendingPdf-detail");

          $(".avoid-word-break").each(function () {
            $(this).css("page-break-inside", "avoid");
            $(this).css("page-break-after", "auto");
            $(this).css("page-break-before", "auto");
          });
          if (!pdfElement) {
            throw new Error("Element with ID 'pendingPdf-detail' not found");
          }
          if (this.state.TotalPending < 600) {
            scalevalue = 2
          }
          else {
            scalevalue = 1.35
          }

          const options = {
            filename: 'requestor.pdf',
            fontSize: 12,
            margin: [5, 5],
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { dpi: 300, letterRendering: true, useCORS: true, scale: 2 },
            jsPDF: {
              unit: 'mm',
              format: [290, 370],
              orientation: 'portrait',
            },
            header: (currentPage: string, pageCount: string, pdf: any) => {
              return {
                text: 'Header on Page ' + currentPage + ' of ' + pageCount,
                style: 'headerStyle',
              };
            },
          };

          html2pdf()
            .set(options)
            .from(pdfElement)
            .toPdf()
            .save(`Exception-Detailed-Report-${moment().format('DD-MM-YYYY')}.pdf`)
            .then(() => {
              this.Successalert('PDF Downloaded successfully!');
            })
            .catch((error: any) => {
              console.error("Error generating or downloading PDF:", error);
            })
            .finally(() => {
              $("#pdf-margin").hide();
              $(".pendingPdf-details").hide();
            });
        }, 5000)
        // ])
      } catch (error) {
        console.error("Error generating or downloading PDF:", error);
        $("#pdf-margin").hide();
        $(".pendingPdf-details").hide();
      }
    } else {
      this.showErrorMessage('No Pending DN Available for Download');
    }
  };


  // new mothod for downloading huge dataset

  public chunkArray(array: string | any[], chunkSize: number) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }



  public async generatePDF(type: string) {
    var pdfElement: HTMLElement;
    // await this.insertBreaks();
    if (type == "Pending") {
      pdfElement = document.getElementById("pendingPdf-detail");
    } else {
      pdfElement = document.getElementById("deliverPdf-details");
    }
    if (isfirstchunck == "true") {
      $(".header_toshow").show();
    } else {
      $(".header_toshow").hide();
    }
    if (islastchunk == "true") {
      $(".footer_show").show();
    } else {
      $(".footer_show").hide();
    }
    var pdfBlob;
    const options = {
      filename: 'requestor.pdf',
      fontSize: 12,
      margin: [5, 5],
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { dpi: 300, letterRendering: true, useCORS: true, scale: 2 },
      pagebreak: { mode: ['css'] },
      jsPDF: {
        unit: 'mm',
        format: [290, 370],
        orientation: 'portrait',
      },
      header: (currentPage: string, pageCount: string, pdf: any) => {
        return {
          text: 'Header on Page ' + currentPage + ' of ' + pageCount,
          style: 'headerStyle',
        };
      },
    };
    // Convert each HTML part to PDF
    await this.waitForRenderCompletion(async () => {
      pdfBlob = await html2pdf().set(options).from(pdfElement).output('blob');
    }, 5000)
    return pdfBlob;
  };


  public async renderHTML(dataChunk: any, type: string) {
    // MasterArray = 0 ;
    return new Promise<void>(async (resolve, reject) => {
      if (type == "Pending") {
        await this.setState({ PDFPendingItem: dataChunk }, () => {
          resolve();
        });
      } else {
        await this.setState({ PDFDeliveredItem: dataChunk }, () => {
          resolve();
        });
      }
    });
  }

  public async renderUnmatchedHTML(dataChunk: any, type: string) {
    return new Promise<void>(async (resolve, reject) => {
      if (type === "Pending") {
        await this.setState({ PDFUnmatchedItem: dataChunk }, () => {
          resolve();
        });
      } else {
        await this.setState({ PDFUnmatchedItemDeliver: dataChunk }, () => {
          resolve();
        });
      }
    });
  }

  public gettotaltransporter(chunkedData: any[]) {
    let totalValuesPending = 0;

    chunkedData.map((items: any[]) => {
      items.forEach((pendingItem: any[]) => {
        pendingItem.forEach((pendingItem1: { count: any; CHRG: any; }) => {
          const tripCount = pendingItem1.count;
          const charge = pendingItem1.CHRG;
          const values_pending = charge * tripCount;
          totalValuesPending += values_pending;
        });
      });
      return totalValuesPending;
    });
    MasterArray = totalValuesPending;
  }



  //working
  public async generateAndMergePDFs(MatchedData: any, UnmatchedData: any, Type: string) {
    try {
      // await this.waitForRenderCompletion(async () => {
      const chunkedData = await this.chunkArray(MatchedData, 2); // Split data into chunks of 1 item each
      const unmatchchunkedData = await this.chunkArray(UnmatchedData, 2); // Split data into chunks of 1 item each
      this.gettotaltransporter(chunkedData);
      const mergedPdf = await PDFDocument.create();
      if (Type == "Pending") {
        $("#pdf-margin").show();
        $(".pendingPdf-details").show();
      } else {
        $("#pdf-margin").show();
        $(".deliverPdf-details").show();
      }
      for (const [index, chunk] of chunkedData.entries()) {
        currentChunkIndex = index;
        // isfirstchunck = index === 0;
        // islastchunk = UnmatchedData.length === 0 && currentChunkIndex === chunkedData.length - 1;
        if (index == 0) {
          isfirstchunck = "true";
        } else {
          isfirstchunck = "false";
        }
        // if (UnmatchedData.length == 0) {
        const totalChunks = chunkedData.length; // Total number of chunks
        if (currentChunkIndex === totalChunks - 1) {
          islastchunk = "true";
          this.setState({
            PDFUnmatchedItem: UnmatchedData
          })
        } else {
          islastchunk = "false";
          this.setState({
            PDFUnmatchedItem: []
          })
        }
        // }
        await this.renderHTML(chunk, Type);
        const pdfBlob:any = await this.generatePDF(Type); // Generate PDF for the chunk
        if (Type == "Pending") {
          this.setState({
            PDFPendingItem: [],
          });
        } else {
          this.setState({
            PDFDeliveredItem: [],
          });
        }
        const pdfBytes = await pdfBlob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => {
          mergedPdf.addPage(page);
        });
      }
      // for (const [index, chunk] of unmatchchunkedData.entries()) {
      //   currentChunkIndex = index;
      //   const totalChunks = unmatchchunkedData.length; // Total number of chunks
      //   if (currentChunkIndex === totalChunks - 1) {
      //     islastchunk = "true";
      //   } else {
      //     islastchunk = "false";
      //   }
      //   await this.renderUnmatchedHTML(chunk, Type);
      //   const pdfBlob = await this.generatePDF(Type); // Generate PDF for the chunk
      //   if (Type == "Pending") {
      //     this.setState({
      //       PDFUnmatchedItem: [],
      //     });
      //   } else {
      //     this.setState({
      //       PDFUnmatchedItemDeliver: [],
      //     });
      //   }
      //   const pdfBytes = await pdfBlob.arrayBuffer();
      //   // Load PDF documents
      //   const pdfDoc = await PDFDocument.load(pdfBytes);
      //   const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      //   copiedPages.forEach(page => {
      //     mergedPdf.addPage(page);
      //   });
      // }
      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(mergedPdfBlob);
      const link = document.createElement('a');
      link.href = url;
      if (Type == "Pending") {
        link.download = `Exception-Detailed-Report-${moment().format('DD-MM-YYYY')}.pdf`; // Set the desired filename here
      } else {
        link.download = `Summary-Detailed-Report-${moment().format('DD-MM-YYYY')}.pdf`; // Set the desired filename here
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.Successalert('PDF Downloaded successfully!');
      // }, 5000);
    } catch (error) {
      console.error("Error generating or merging PDFs:", error);
      // Handle error
    } finally {
      $("#pdf-margin").hide();
      if (Type == "Pending") {
        $(".pendingPdf-details").hide();
      } else {
        $(".deliverPdf-details").show();
      }
      $(".header_toshow").show();
      $(".footer_show").show()
    }
  }


  public waitForRenderCompletion = async (callback: { (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): void; }, timeout: number) => {
    await this.forceUpdate(callback); // Trigger re-rendering to ensure rendering completion
    await new Promise(resolve => setTimeout(resolve, timeout)); // Wait for the specified timeout duration
  };

  public waitForRenderCompletionDatatable = (callback: { (): Promise<void>; (): any; }, delay = 0) => {
    return new Promise<void>(resolve => {
      setTimeout(async () => {
        await callback();
        resolve();
      }, delay);
    });
  }


  public deliveredPDF = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    var mathcedItems = this.state.PDFDeliveredItem.length;
    var unmathcedItems = this.state.PDFUnmatchedItemDeliver.length;
    if (mathcedItems != 0 || unmathcedItems != 0) {
      $("#pdf-margin").show();
      $(".deliverPdf").show();
      try {
        await this.waitForRenderCompletion(async () => {
          var pdfjs = document.querySelector("#mypdf") as HTMLElement;
          if (!pdfjs) {
            throw new Error("Element with ID 'mypdf' not found");
          }
          const options = {
            filename: `requestor.pdf`,
            margin: [5, 5],
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { dpi: 400, letterRendering: true, useCORS: true, scale: 3 },
            pagebreak: { mode: ['css'] },
            jsPDF: {
              unit: 'mm',
              // format: 'a4',
              format: [290, 370],
              orientation: 'portrait',
            },
            header: function (pdf: { setFontSize: (arg0: number) => void; text: (arg0: string, arg1: number, arg2: number) => void; }) {
              pdf.setFontSize(12);
              pdf.text('Hello, this is a custom header', 10, 10);
            },
          };
          const blob = await html2pdf().set(options).from(pdfjs).toPdf().output('blob');
          const file = new File([blob], 'requestor.pdf', { type: blob.type });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = `Summary-Report-${moment().format('DD-MM-YYYY')}.pdf`;
          this.Successalert('PDF Downloaded successfully!');
          document.body.appendChild(link);

          // Trigger a click on the link to start the download
          link.click();
        }, 5000);
      } catch (error) {
        console.error("Error generating or downloading PDF:", error);
      }
      $("#pdf-margin").hide();
      $(".deliverPdf").hide();
      // $(".pdf_banner").show();
    }
    else {
      this.showErrorMessage('No Delivered DN Available for Download');
    }

  };


  public deliveredDetailedPDF = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    var mathcedItems = this.state.PDFDeliveredItem.length;
    var unmathcedItems = this.state.PDFUnmatchedItemDeliver.length;
    var scalevalue;
    if (mathcedItems != 0 || unmathcedItems != 0) {
      $("#pdf-margin").show();
      $(".deliverPdf-details").show();
      try {
        await this.waitForRenderCompletion(async () => {
          var pdfjs = document.querySelector("#mypdf-details") as HTMLElement;
          if (!pdfjs) {
            throw new Error("Element with ID 'mypdf' not found");
          }
          const options = {
            filename: `requestor.pdf`,
            margin: [5, 5],
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { dpi: 400, letterRendering: true, useCORS: true, scale: 2 },
            pagebreak: { mode: ['css'] },
            jsPDF: {
              unit: 'mm',
              // format: 'a4',
              format: [290, 370],
              orientation: 'portrait',
            },
            header: function (pdf: { setFontSize: (arg0: number) => void; text: (arg0: string, arg1: number, arg2: number) => void; }) {
              pdf.setFontSize(12);
              pdf.text('Hello, this is a custom header', 10, 10);
            },
          };
          const blob = await html2pdf().set(options).from(pdfjs).toPdf().output('blob');
          const file = new File([blob], 'requestor.pdf', { type: blob.type });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = `Summary-Detailed-Report-${moment().format('DD-MM-YYYY')}.pdf`
          this.Successalert('PDF Downloaded successfully!');
          document.body.appendChild(link);
          link.click();
        }, 5000);
      } catch (error) {
        console.error("Error generating or downloading PDF:", error);
      }
      $("#pdf-margin").hide();
      $(".deliverPdf-details").hide();
      // $(".pdf_banner").show();
    } else {
      this.showErrorMessage('No Delivered DN Available for Download')
    }
  };


  public async downloadConsolidatedPDF() {
    if (this.state.TotalDelivered.length != 0) {
      this.pleasewaitalert('Downloading');
      const pdfFiles = await this.fetchPDFFiles();
      if (pdfFiles.length != 0) {
        try {
          // Show downloading loader
          const mergedPdfBytes = await this.mergePDFFiles(pdfFiles);
          // Download the merged PDF file
          if (mergedPdfBytes !== null) { // Check if merged PDF is not null
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ConsolidatedPDF-Report-${moment().format('DD-MM-YYYY')}.pdf`
            this.Successalert('PDF Downloaded successfully!');
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            this.showErrorMessage('No Valid Document Available');
          }
        } catch (error) {
          console.error('Error downloading PDF:', error);
          this.showErrorMessage('No Valid Document Available. Please try again later.')
        }
      } else {
        this.showErrorMessage('No DN Available for Download')
      }
    } else {
      this.showErrorMessage('No Delivered DN Available');
    }

  }

  public async fetchPDFFiles(): Promise<{ data: Uint8Array; fileName: string; CreationDate: string; }[]> {

    const DNnum: string[] = [];

    for (const item of this.state.FilteredItem) {
      if (item.DNDashBoardDeliveryStatus === 'Delivered') {
        const DNNumber = item.DeliveryNumber;
        if (DNnum.indexOf(DNNumber) === -1) {
          DNnum.push(DNNumber);
        }
      }
    }
    const reportFiles: { data: Uint8Array; fileName: string; CreationDate: string }[] = [];
    // const stampedItems: any[] = this.state.StampedItem;
    // const filteredItems = this.state.FilteredItem.filter(item => item.DNDashBoardDeliveryStatus === 'Delivered');
    for (const DNNumber of DNnum) {
      const files = await newweb.lists.getByTitle("DN Customer Emirates ID")
        .items.select("FileRef", "FileLeafRef", "Created")
        .filter(`substringof('${DNNumber}', FileLeafRef)`)
        .getAll();

      for (const file of files) {
        // const fileName = file.FileLeafRef.split(".")[0];
        // const matchingItem = filteredItems.find(item => item.DeliveryNumber === fileName);
        // if (matchingItem) {
        try {
          // const response = await fetch(file.FileRef);
          const response = await fetch(file.FileRef, {
            headers: {
              'Accept': 'application/json;odata=verbose',
            },
          });
          const arrayBuffer = await response.arrayBuffer();
          if (arrayBuffer.byteLength !== 0) {
            const data = new Uint8Array(arrayBuffer);
            const CreationDate = moment(file.Created, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm");
            reportFiles.push({ data, fileName: file.FileLeafRef, CreationDate });
          }
        } catch (error) {
          console.error(`Error processing file '${file.FileLeafRef}':`, error);
          return [];
        }
        // }
      }
    }
    return reportFiles;

  }


  public async mergePDFFiles(pdfFiles: { data: Uint8Array; fileName: string; CreationDate: string }[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    let validFileFound = false; // Flag to track if any valid file is found
    for (const pdfFile of pdfFiles) {
      try {
        const pdfBytes = pdfFile.data;
        const fileName = pdfFile.fileName;
        const CreationDate = pdfFile.CreationDate;
        var stringFileName: string = fileName;
        var FileNameArray = stringFileName.split(".");
        // if (this.isValidPdfBytes(pdfBytes) == false) {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        for (let j = 0; j < pdfDoc.getPageCount(); j++) {
          const [page] = await mergedPdf.copyPages(pdfDoc, [j]);

          const pageSize = page.getSize();

          // Use a standard font (Times Roman)
          const font = await mergedPdf.embedFont(StandardFonts.TimesRoman);

          // Draw DN number on left side of the page
          const dnText = `DN Number: ${FileNameArray[0]}`;
          const dnTextWidth = font.widthOfTextAtSize(dnText, 12);
          page.drawText(dnText, {
            x: 50, // Adjusted position for left side
            y: pageSize.height - 50,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });

          // Draw creation date on right side of the page
          const creationDateText = `Creation Date: ${CreationDate}`;
          const creationDateTextWidth = font.widthOfTextAtSize(creationDateText, 12);
          page.drawText(creationDateText, {
            x: pageSize.width - creationDateTextWidth - 50, // Adjusted position for right side
            y: pageSize.height - 50,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });

          mergedPdf.addPage(page);
        }
        validFileFound = true; // Set the flag to true as a valid file is found
        // }
      } catch (error) {
        console.error(`Error processing PDF file '${pdfFile.fileName}':`, error);
      }
    }
    if (!validFileFound) { // If no valid files found
      console.error("No valid PDF files found.");
      return null;
    } else {
      return await mergedPdf.save();
    }

  }

  public pleasewaitalert(message: string) {
    var htmlText = message === 'Downloading' ? 'The PDF file is being downloaded. Please wait...' : 'The PDF file is being uploaded. Please wait...';
    Swal.fire({
      title: message,
      html: htmlText,
      allowOutsideClick: false,
      showConfirmButton: false, // Disable the OK button
      customClass: {
        popup: 'swal_success', // Class for the overall modal
        title: 'downloading_title', // Class for title
        content: 'my-html-container', // Class for HTML content
      },
      imageUrl: 'https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Eclipse.gif',
    });
  }

  public Successalert(message: string) {
    Swal.fire({
      iconHtml: '<img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/successfully_img%201.svg" class="my-img-class">',
      title: 'Success',
      text: message,
      icon: 'success',
      allowOutsideClick: false,
      showConfirmButton: true,
      customClass: {
        popup: 'swal_success', // Class for the overall modal
        title: 'upload_success_title', // Class for title
        content: 'upload_success_content', // Class for text
        confirmButton: 'My_btn' // Class for the confirm button
      }
    });
  }

  public getPDFDetailsDeliver(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const filteredItems = this.state.FilteredItem.filter(item => item.DNDashBoardDeliveryStatus === 'Delivered');
    const newState:any = {
      deliverArrayItem: [],
      pendingArrayItem: [],
      PDFDeliveredItem: [],
      PDFPendingItem: [],
      PDFUnmatchedItemDeliver: [],
      FilteredItem: filteredItems,
    };
    this.setState(newState, () => {
      this.fetchPDFDeliveredDetails(e);
    });
  }



  public fetchPDFDeliveredDetails(e: { preventDefault: () => void; }) {
    e.preventDefault();
    this.pleasewaitalert('Downloading');
    let MatchedItems: any;
    let UnMatchedItems: any;
    const tableList = this.state.FilteredItem;
    newweb.lists.getByTitle("Transporter Charges Master").items
      .select("Title", "FROM_LOC", "TO_LOC", "CHRG")
      // .filter("IsActive eq '1'")
      .getAll()
      .then((response) => {

        // #### filter Deliver Value ####
        const deliverArray = tableList.filter(item => {
          const DNDashBoardDeliveryStatus = item.DNDashBoardDeliveryStatus;
          const truckNumber = item.Trucknumber;
          const toAddress = item.ToAddress;
          const fromAddress = item.FromAddress;

          return DNDashBoardDeliveryStatus === "Delivered" && truckNumber && toAddress && fromAddress;
        });

        // Update the state with the filtered array
        this.setState({
          deliverArrayItem: deliverArray
        });

        // Calculate trip count 
        var data = new Set()
        var tripcount_deliver = []
        for (let i = 0; i < deliverArray.length; i++) {
          var truckType = deliverArray[i].Trucktype;
          var fromAddress = deliverArray[i].FromAddress;
          var toAddress = deliverArray[i].ToAddress;
          var revisedNumber = deliverArray[i].RevisedTripNuber;
          // var final_delevered_count = []
          if (revisedNumber != null) {
            const key = truckType + fromAddress + toAddress + revisedNumber
            if (!data.has(key)) {
              data.add(key)
              tripcount_deliver.push(deliverArray[i])
            }
          } else {
            tripcount_deliver.push(deliverArray[i])

          }
        }
        //consle.log("step 2 filterarraryvalues_deliver key", filterarraryvalues_deliver);

        // ### add trip count column 
        var addTripCountColumn = [];
        let seen1 = new Map();
        addTripCountColumn = tripcount_deliver.map((obj) => {
          const key = obj.Trucktype + obj.FromAddress + obj.ToAddress;
          if (!seen1.has(key)) {
            seen1.set(key, 1);
          } else {
            seen1.set(key, seen1.get(key) + 1);
          }

          return {
            TruckNumber: obj.Trucktype,
            FromAddress: obj.FromAddress,
            ToAddress: obj.ToAddress,
            transporterName: obj.TransporterName,
            count: seen1.get(key)
          };
        });
        var maxTripValue:any = {};
        // Iterate through the array and update the maxCounts object
        addTripCountColumn.forEach(item => {
          const key = `${item.TruckNumber}-${item.FromAddress}-${item.ToAddress}`;
          if (!maxTripValue[key] || item.count > maxTripValue[key].count) {
            maxTripValue[key] = item;
          }
        });

        // Convert the values of maxCounts object back to an array using map
        var maxCountDeliverValue = Object.keys(maxTripValue).map(key => maxTripValue[key]);
        // ### filter matched data from charge list & add charge column  
        const matchedObjectsDeliver: any[] = maxCountDeliverValue
          .map(obj2 => {
            const matchingResponses = response.filter(obj1 =>
              obj1.FROM_LOC.replace(/\s/g, '') === obj2.FromAddress.replace(/\s/g, '') &&
              obj1.TO_LOC.replace(/\s/g, '') === obj2.ToAddress.replace(/\s/g, '') &&
              obj1.Title.replace(/\s/g, '') === obj2.TruckNumber.replace(/\s/g, '')
            );
            // If at least one matching response is found, add a new property 'CHRG' to the object
            if (matchingResponses.length > 0) {
              return {
                ...obj2,
                CHRG: matchingResponses[0].CHRG // Assuming you want the first match's CHRG
              };
            }
            return null;
          })
          .filter(Boolean);
        // ### filter unMatched data from charge list & add charge column  

        const unmatchedObjects = maxCountDeliverValue
          .filter((obj2) =>
            !response.some(
              (obj1) =>
                obj1.FROM_LOC.replace(/\s/g, '') === obj2.FromAddress.replace(/\s/g, '') &&
                obj1.TO_LOC.replace(/\s/g, '') === obj2.ToAddress.replace(/\s/g, '') &&
                obj1.Title.replace(/\s/g, '') === obj2.TruckNumber.replace(/\s/g, '')
            )
          )
          .map((obj2) => {
            // Add CHRG property with a default value
            const CHRG = 0;
            return {
              ...obj2,
              CHRG,
            };
          });
        // ### Group data based on UniqueTruck type
        const UniqueMatchedArrayGroupedByTruckType = matchedObjectsDeliver.reduce((result, item) => {
          // const existingGroup = result.find((group) => group[0].TruckNumber === item.TruckNumber);
          const existingGroup = result.find((group: {
            TruckNumber: any; FromAddress: any; 
}[]) => group[0].TruckNumber === item.TruckNumber && group[0].FromAddress == item.FromAddress);
          if (existingGroup) {
            existingGroup.push(item);
          } else {
            result.push([item]);
            // item.Key = key; // Add a Key property for reference
          }
          return result;
        }, []);
        UniqueMatchedArrayGroupedByTruckType.sort((a: { TruckNumber: any; }[], b: { TruckNumber: any; }[]) => {
          const truckNumberA = a[0].TruckNumber;
          const truckNumberB = b[0].TruckNumber;
          // Use localeCompare for string comparison
          return truckNumberA.localeCompare(truckNumberB);
        });
        // ### Group data based on UniqueTruck type
        const UniqueUnmatchedArrayGroupedByTruckType = unmatchedObjects.reduce((result, item) => {
          // const existingGroup = result.find((group) => group[0].TruckNumber === item.TruckNumber);
          const existingGroup = result.find((group: {
            TruckNumber: any; FromAddress: any; 
}[]) => group[0].TruckNumber === item.TruckNumber && group[0].FromAddress == item.FromAddress);
          if (existingGroup) {
            existingGroup.push(item);
          } else {
            result.push([item]);
            // item.Key = key; // Add a Key property for reference
          }
          return result;
        }, []);
        UniqueUnmatchedArrayGroupedByTruckType.sort((a: { TruckNumber: any; }[], b: { TruckNumber: any; }[]) => {
          const truckNumberA = a[0].TruckNumber;
          const truckNumberB = b[0].TruckNumber;
          // Use localeCompare for string comparison
          return truckNumberA.localeCompare(truckNumberB);
        });

        MatchedItems = UniqueMatchedArrayGroupedByTruckType;
        UnMatchedItems = UniqueUnmatchedArrayGroupedByTruckType;

        this.setState({
          PDFDeliveredItem: UniqueMatchedArrayGroupedByTruckType,
          PDFUnmatchedItemDeliver: UniqueUnmatchedArrayGroupedByTruckType
        }, () => {
          const deliveredItemsEmpty = this.state.PDFDeliveredItem.length === 0;
          const unmatchedItemsEmpty = this.state.PDFUnmatchedItemDeliver.length === 0;

          if (deliveredItemsEmpty && unmatchedItemsEmpty) {
            $(".Transporter_delivery_details").addClass("nodata_transporter");
          } else {
            $(".Transporter_delivery_details").removeClass("nodata_transporter");
          }
          if (this.state.isClickedDeliverDetailedItem == false) {
            this.deliveredPDF(e);
          }
          else if (this.state.isClickedDeliverDetailedItem == true) {
            if (this.state.TotalDelivered < 600) {
              this.deliveredDetailedPDF(e);
            } else {
              this.generateAndMergePDFs(MatchedItems, UnMatchedItems, "Delivered");
            }
          }

        });


      })
      .catch((error) => {
        console.error("Error fetching PDF details", error);
      });
  }

  public getPDFDetailsPending(e: { preventDefault: () => void; }) {
    e.preventDefault();

    // const tableItems = this.state.AllItems;
    const filteredItems = this.state.FilteredItem.filter(item => item.DNDashBoardDeliveryStatus === 'Pending');
    const newState:any = {
      deliverArrayItem: [],
      pendingArrayItem: [],
      PDFDeliveredItem: [],
      PDFPendingItem: [],
      PDFUnmatchedItemDeliver: [],
      FilteredItem: filteredItems,
    };
    this.setState(newState, () => {
      this.fetchPDFPendingDetails(e);
    });
  }



  private async fetchPDFPendingDetails(e: any) {
    try {
      const tableListItems = this.state.FilteredItem;
      this.pleasewaitalert('Downloading');
      let MatchedItems;
      let UnMatchedItems;

      await newweb.lists.getByTitle("Transporter Charges Master").items
        .select("Title", "FROM_LOC", "TO_LOC", "CHRG")
        .getAll()
        .then(async (response) => {
          if (response.length != 0) {
            const pendingArray = tableListItems.filter(item =>
              item.DNDashBoardDeliveryStatus === "Pending" &&
              item.Trucknumber &&
              item.ToAddress &&
              item.FromAddress
            );
            this.setState({
              pendingArrayItem: pendingArray
            })

            // ## Calculate trip count 
            var data = new Set()
            var tripvalues_pending = [];

            for (let i = 0; i < pendingArray.length; i++) {
              var truckType = pendingArray[i].Trucktype;
              var fromAddress = pendingArray[i].FromAddress;
              var toAddress = pendingArray[i].ToAddress;
              var revisedNumber = pendingArray[i].RevisedTripNuber;

              var final_delevered_count = []
              if (revisedNumber != null) {

                const key = truckType + fromAddress + toAddress + revisedNumber
                if (!data.has(key)) {
                  data.add(key)
                  tripvalues_pending.push(pendingArray[i])
                }

              } else {
                tripvalues_pending.push(pendingArray[i])

              }
            }
            // ### add trip count column 
            var addTripValue_pending = [];
            let seen1 = new Map();
            addTripValue_pending = tripvalues_pending.map((obj) => {
              const key = obj.Trucktype + obj.FromAddress + obj.ToAddress;

              if (!seen1.has(key)) {
                seen1.set(key, 1);
              } else {
                seen1.set(key, seen1.get(key) + 1);
              }

              return {
                TruckNumber: obj.Trucktype,
                FromAddress: obj.FromAddress,
                ToAddress: obj.ToAddress,
                deliveryNumber: obj.DeliveryNumber,
                customerName: obj.CompanyName,
                date: obj.ActualCreatedDateTime,
                truckNumber: obj.Trucknumber,
                revisedTripNumber: obj.RevisedTripNuber,
                transporterName: obj.TransporterName,
                count: seen1.get(key)
              };
            });

            // ### filter maxTripCounts for one location  
            var maxTripCounts:any = {};
            // Iterate through the array and update the maxCounts object
            addTripValue_pending.forEach(item => {
              const key = `${item.TruckNumber}-${item.FromAddress}-${item.ToAddress}`;
              if (!maxTripCounts[key] || item.count > maxTripCounts[key].count) {
                maxTripCounts[key] = item;
              }
            });

            // Convert the values of maxCounts object back to an array using map
            var maxTripCountPending = Object.keys(maxTripCounts).map(key => maxTripCounts[key]);

            const matchedObjects: any[] = maxTripCountPending
              .map(obj2 => {
                const matchingResponses = response.filter(obj1 =>
                  obj1.FROM_LOC.replace(/\s/g, '') === obj2.FromAddress.replace(/\s/g, '') &&
                  obj1.TO_LOC.replace(/\s/g, '') === obj2.ToAddress.replace(/\s/g, '') &&
                  obj1.Title.replace(/\s/g, '') === obj2.TruckNumber.replace(/\s/g, '')
                );
                // If at least one matching response is found, add a new property 'CHRG' to the object
                if (matchingResponses.length > 0) {
                  return {
                    ...obj2,
                    CHRG: matchingResponses[0].CHRG // Assuming you want the first match's CHRG
                  };
                }
                return null;
              }).filter(Boolean);


            // ### filter unMatched data from charge list 
            const unmatchedObjects = maxTripCountPending
              .filter((obj2) =>
                !response.some(
                  (obj1) =>
                    obj1.FROM_LOC.replace(/\s/g, '') === obj2.FromAddress.replace(/\s/g, '') &&
                    obj1.TO_LOC.replace(/\s/g, '') === obj2.ToAddress.replace(/\s/g, '') &&
                    obj1.Title.replace(/\s/g, '') === obj2.TruckNumber.replace(/\s/g, '')
                )
              )
              .map((obj2) => {

                // Add CHRG property with a default value (you can modify this as needed)
                const CHRG = 0;

                return {
                  ...obj2,
                  CHRG,

                };
              });


            // ### Group data based on UniqueTruck type
            const UniqueMatchedArrayGroupedByTruckType = matchedObjects.reduce((result, item) => {
              // const existingGroup = result.find((group) => group[0].TruckNumber === item.TruckNumber);
              const existingGroup = result.find((group: {
                TruckNumber: any; FromAddress: any; 
}[]) => group[0].TruckNumber === item.TruckNumber && group[0].FromAddress == item.FromAddress);
              if (existingGroup) {
                existingGroup.push(item);
              } else {
                result.push([item]);
                // item.Key = key; // Add a Key property for reference
              }
              return result;
            }, []);
            UniqueMatchedArrayGroupedByTruckType.sort((a: { TruckNumber: any; }[], b: { TruckNumber: any; }[]) => {
              const truckNumberA = a[0].TruckNumber;
              const truckNumberB = b[0].TruckNumber;
              // Use localeCompare for string comparison
              return truckNumberA.localeCompare(truckNumberB);
            });
            // ### Group data based on UniqueTruck type
            const UniqueUnmatchedArrayGroupedByTruckType = unmatchedObjects.reduce((result, item) => {
              // const existingGroup = result.find((group) => group[0].TruckNumber === item.TruckNumber);
              const existingGroup = result.find((group: {
                TruckNumber: any; FromAddress: any; 
}[]) => group[0].TruckNumber === item.TruckNumber && group[0].FromAddress == item.FromAddress);
              if (existingGroup) {
                existingGroup.push(item);
              } else {
                result.push([item]);
                // item.Key = key; // Add a Key property for reference
              }
              return result;
            }, []);
            UniqueUnmatchedArrayGroupedByTruckType.sort((a: { TruckNumber: any; }[], b: { TruckNumber: any; }[]) => {
              const truckNumberA = a[0].TruckNumber;
              const truckNumberB = b[0].TruckNumber;
              // Use localeCompare for string comparison
              return truckNumberA.localeCompare(truckNumberB);
            });
            MatchedItems = UniqueMatchedArrayGroupedByTruckType;
            UnMatchedItems = UniqueUnmatchedArrayGroupedByTruckType;
            await this.waitForRenderCompletion(async () => {
              this.setState({
                PDFPendingItem: UniqueMatchedArrayGroupedByTruckType,
                PDFUnmatchedItem: UniqueUnmatchedArrayGroupedByTruckType
              }, () => {
                const pendingItemsEmpty = this.state.PDFPendingItem.length === 0;
                const unmatchedItemsEmpty = this.state.PDFUnmatchedItem.length === 0;
                // console.log(this.state.PDFPendingItem, this.state.PDFUnmatchedItem);
                if (pendingItemsEmpty && unmatchedItemsEmpty) {
                  $(".transport_trip_details_banner").addClass("nodata_transporter");
                } else {
                  $(".transport_trip_details_banner").removeClass("nodata_transporter");
                }
              });
            }, 0);
            if (this.state.isClickedpendingDetailedItem == false) {
              await this.pendingPDF(e);
            }
            else if (this.state.isClickedpendingDetailedItem == true) {
              // setTimeout(() => {
              // await Promise.all([
              if (this.state.TotalPending < 600) {
                this.pendingDetailedPDF(e)

              } else {
                this.generateAndMergePDFs(MatchedItems, UnMatchedItems, "Pending");
              }
              // ])
            }
          }
        });
    } catch (error) {
      console.error("Error fetching PDF details", error);
    }
  }


  handleReportSelection = (event:any) => {
    var selectedReport = event.target.value;
    const selectedOptionText = event.target.options[event.target.selectedIndex].text.trim(); // Get the text content of the selected option and trim any leading or trailing whitespace
    const optionTextLength = selectedOptionText.length;
    if (selectedReport == "") {
      $("#reportDropdown").css("width", "130px"); // Set width to 100px if option text length is less than 10 characters
      $("#reportDropdown").get(0).style.setProperty("background-position-x", "110px", "important");
    } else {
      if (optionTextLength <= 20) { // Example condition, adjust as needed
        $("#reportDropdown").css("width", "150px"); // Set width to 100px if option text length is less than 10 characters
        $("#reportDropdown").get(0).style.setProperty("background-position-x", "130px", "important");
      } else {
        $("#reportDropdown").css("width", "200px"); // Set width to 500px otherwise
        $("#reportDropdown").get(0).style.setProperty("background-position-x", "180px", "important");
      }
    }

    this.setState({ selectedReport }, () => {
      this.SelectReport(event);
    })
  };

  SelectReport = async (e: any) => {
    await this.getFilteredItems();//10
    // You can call the specific function based on the selected report
    if (this.state.selectedReport === 'summary') {
      this.setState({
        isClickedDeliverDetailedItem: false,
      }, () => {
        this.getPDFDetailsDeliver(e);
      })
    } else if (this.state.selectedReport === 'exception') {
      this.setState({
        isClickedpendingDetailedItem: false,
      }, () => {
        this.getPDFDetailsPending(e);
      })
    } else if (this.state.selectedReport === 'summaryDetailed') {
      this.setState({
        isClickedDeliverDetailedItem: true,
      }, () => {
        this.getPDFDetailsDeliver(e);
      })

    } else if (this.state.selectedReport === 'exceptionDetailed') {
      // MasterArray = 0;
      this.setState({
        isClickedpendingDetailedItem: true,
      }, () => {
        this.getPDFDetailsPending(e);

      })
    } else if (this.state.selectedReport === 'consolidatedpdf') {
      this.downloadConsolidatedPDF();
    }
  };

  public gotoBilligDashboard() {
    $(".Transporter").removeClass("active");
    $(".Billing").addClass("active");

    this.setState({
      isTransporterDashboard: false,
      isBillingDashboard: true
    })
  }

  public setSelectedTransporter = (e: React.ChangeEvent<HTMLSelectElement>, value: string) => {
    if (value != null) {
      if (value !== this.state.selectedTransporter) {
        const startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        Items1 = value;

        // Save startDate and endDate to session storage
        sessionStorage.setItem('startDate', startDate);
        sessionStorage.setItem('endDate', endDate);
        sessionStorage.setItem('Transporter', Items1);
        sessionStorage.setItem('Transporterlist', JSON.stringify(transporterList));
        sessionStorage.setItem('submitButtonClicked', 'true');
        // Reload the page
        window.location.reload();
        // const newState = {
        //   selectedTransporter: value,
        //   startDate: newStartDate,
        //   endDate: newEndDate,
        //   deliverArrayItem: [],
        //   pendingArrayItem: [],
        //   PDFDeliveredItem: [],
        //   PDFPendingItem: [],
        //   PDFUnmatchedItemDeliver: [],
        // };
        // selectedTransporter = value;
        // Items1 = selectedTransporter;
        // Transporter_Selected = Items1;
        // this.setState(newState, () => {
        //   this.Group_Details("Selection_of_transporter");
        //   // await Promise.all([
        //   //   // this.getItemsAndTotalCount1(e)
        //   //   this.Group_Details("selection_of_transporter"),
        //   // ])
        // });
      }
    } else {
      if (this.state.selectedTransporter !== '') {
        const newState:any = {
          deliverArrayItem: [],
          pendingArrayItem: [],
          PDFDeliveredItem: [],
          PDFPendingItem: [],
          PDFUnmatchedItemDeliver: [],
          selectedTransporter: '',
        };
        selectedTransporter = '';
        Transporter_Selected = "-";
        this.setState(newState, () => {
          this.Group_Details("Selection_of_transporter");
          // await Promise.all([
          //   this.getItemsAndTotalCount1(e),
          // ])
        });
      }
    }
  }


  public render(): React.ReactElement<IDnTransporterDashboardProps> {
    var handler = this;
    var TransporterTotal_pen = 0;
    var TransporterTotal_del = 0;
    var uniqueTruckNumbers: any[] = [];
    var unmatchedUniqueTruckNumbers: any[] = [];
    var uniqueTruckNumbers_deliver: any[] = [];
    var unmatchedUniqueTruckNumbers_del: any[] = [];
    detailedUniqueTruckNumbers = [];
    detailedUnmatchedUniqueTruckNumbers = [];
    detailedUniqueTruckNumbers_del = [];
    detailedUnmatchedUniqueTruckNumbers_del = [];
    var TruckTypetotalValue_pending = 0;
    var totalCHRG1_pending = 0; // Variable to store the total CHRG for the current TruckNumber
    var totalCHRG2_pending = 0;
    var totalCHRG1_pendingUnmatch = 0; // Variable to store the total CHRG for the current TruckNumber
    var totalCHRG2_pendingUnmatch = 0;
    var totalCHRG1_del = 0; // Variable to store the total CHRG for the current TruckNumber
    var totalCHRG2_del = 0;
    var totalCHRG1_deliverUnmatch = 0; // Variable to store the total CHRG for the current TruckNumber
    var totalCHRG2_deliverUnmatch = 0;
    // var uniqueFromLocations = [];
    const { selectedReport } = this.state;
    const { selectedTransporter } = this.state;
    // const { RemarkItems, remarks } = this.state;


    DeliveredReportDates = [];



    const PendingMatchedPDFJsx: JSX.Element[] = handler.state.PDFPendingItem.map(function (item, key) {
      var locationWiseValue = 0;
      var TruckTypetotalValue_pending = 0;
      var uniqueFromLocations: any[] = [];
      var prevFromLocation: null = null;

      // var truckLength;
      // Sort the items based on FROM_LOC
      if (handler.state.isClickedpendingDetailedItem == false) {
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));

        // Check if the truck number is unique
        if (uniqueTruckNumbers.indexOf(item[0].TruckNumber) === -1) {
          // truckLength = uniqueTruckNumbers.length;
          uniqueTruckNumbers.push(item[0].TruckNumber);
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead className='column_head'>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render table rows */}
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {
                      const tripCount = pendingItem.count;
                      const charge = pendingItem.CHRG;
                      const values_pending = charge * tripCount;
                      const fromLocation = pendingItem.FromAddress;
                      const toLocation = pendingItem.ToAddress;
                      totalCHRG1_pending = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);

                      // Update values
                      locationWiseValue += values_pending;
                      if (charge != 0) {
                        TransporterTotal_pen += values_pending;
                      }
                      // Render unique fromLocations
                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                          </>
                        );
                      } else {
                        // Render subsequent rows for the same fromLocation
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingItem.FromAddress === fromLocation) {
                        total += pendingItem.CHRG * pendingItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}
                </table>
                {/* {uniqueFromLocations.length > 1 && ( */}

                <div className="total_truck_block" id={`total-trucktype-${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pending}</p>
                </div>
                {/* )} */}
              </div>
            </div>
          );
        } else {
          // Return JSX for repeated truck numbers
          // truckLength = uniqueTruckNumbers.length;
          let TruckTypeLengths = key - 1;
          $("#total-trucktype-" + TruckTypeLengths + "").hide();

          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render table rows */}
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {

                      const tripCount = pendingItem.count;
                      const charge = pendingItem.CHRG;
                      const values_pending = charge * tripCount;
                      const fromLocation = pendingItem.FromAddress;
                      const toLocation = pendingItem.ToAddress;
                      totalCHRG2_pending = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);
                      // TruckTypetotalValue_pending = totalCHRG2;
                      // Update values
                      locationWiseValue += values_pending;
                      // TruckTypetotalValue_pending += locationWiseValue;
                      if (charge != 0) {
                        TransporterTotal_pen += values_pending;
                      }

                      // Render unique fromLocations
                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>

                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                          </>
                        );
                      } else {
                        // Render subsequent rows for the same fromLocation
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>

                  {/* Render <tfoot> only if fromLocation changes */}
                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingItem.FromAddress === fromLocation) {
                        total += pendingItem.CHRG * pendingItem.count;
                      }
                      return total;
                    }, 0);
                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}

                  {/* Render "Total of Truck Type" only at the last occurrence of the truck number */}
                </table>

                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pending + totalCHRG2_pending}</p>
                </div>
              </div>
            </div>
          );
        }
      }
    });

    const PendingUnMatchedPDFJsx: JSX.Element[] = handler.state.PDFUnmatchedItem.map(function (item, key) {

      var locationWiseValue_pen = 0;
      var TruckTypetotalValue_pending = 0;
      var values_pending = 0;
      var charge;
      var tripCount;
      var uniqueFromLocations: any[] = [];
      var prevFromLocation: null = null;

      // Sort the items based on FROM_LOC
      if (handler.state.isClickedpendingDetailedItem == false) {
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));

        if (unmatchedUniqueTruckNumbers.indexOf(item[0].TruckNumber) === -1) {
          unmatchedUniqueTruckNumbers.push(item[0].TruckNumber);
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {

                      tripCount = pendingItem.count;
                      charge = pendingItem.CHRG
                      values_pending = charge * tripCount;
                      var fromLocation = pendingItem.FromAddress;
                      var toLocation = pendingItem.ToAddress;
                      totalCHRG1_pendingUnmatch = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);
                      locationWiseValue_pen = locationWiseValue_pen + values_pending;
                      if (charge != 0) {
                        TruckTypetotalValue_pending = TruckTypetotalValue_pending + values_pending;
                        TransporterTotal_pen = TransporterTotal_pen + values_pending;
                      }


                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }
                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>

                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }

                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>

                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingUnmatchItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingUnmatchItem.FromAddress === fromLocation) {
                        total += pendingUnmatchItem.CHRG * pendingUnmatchItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}

                </table>

                <div className="total_truck_block" id={`total-trucktype-pen${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pendingUnmatch}</p>
                </div>

              </div>
            </div>
          );
        } else {
          let TruckTypeLengthPen = key - 1;
          $("#total-trucktype-pen" + TruckTypeLengthPen + "").hide();
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                {/* <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4> */}
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {

                      tripCount = pendingItem.count;
                      charge = pendingItem.CHRG
                      values_pending = charge * tripCount;
                      var fromLocation = pendingItem.FromAddress;
                      var toLocation = pendingItem.ToAddress;
                      totalCHRG2_pendingUnmatch = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);

                      locationWiseValue_pen = locationWiseValue_pen + values_pending;
                      if (charge != 0) {
                        TruckTypetotalValue_pending = TruckTypetotalValue_pending + values_pending;
                        TransporterTotal_pen = TransporterTotal_pen + values_pending;

                      }
                      var totalformlocationcount = 5
                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>

                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }
                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>
                              }
                            </tr>

                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>

                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }

                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingItem.FromAddress === fromLocation) {
                        total += pendingItem.CHRG * pendingItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value ({fromLocation}):
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}
                </table>

                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pendingUnmatch + totalCHRG2_pendingUnmatch}</p>
                </div>
              </div>
            </div>
          );
        }
      }
    });

    // Detailed jsx  - old
    const DetailedPendingMatchedPDFJsx: JSX.Element[] = handler.state.PDFPendingItem.map(function (item, key) {
      var locationWiseValue = 0;
      var TruckTypetotalValue_pending = 0;
      var uniqueFromLocations: any[] = [];
      var prevFromLocation: null = null;
      var truckLength;
      if (handler.state.isClickedpendingDetailedItem == true) {
        // Sort the items based on FROM_LOC
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
        // Check if the truck number is unique
        if (detailedUniqueTruckNumbers.indexOf(item[0].TruckNumber) === -1) {
          // truckLength = detailedUniqueTruckNumbers.length;
          detailedUniqueTruckNumbers.push(item[0].TruckNumber);
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table print-friendly">
                  <thead>
                    <tr className='avoid-word-break'>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render table rows */}
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {
                      const tripCount = pendingItem.count;
                      const charge = pendingItem.CHRG;
                      const values_pending = charge * tripCount;
                      const fromLocation = pendingItem.FromAddress;
                      const toLocation = pendingItem.ToAddress;
                      totalCHRG1_pending = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);

                      // Update values
                      locationWiseValue += values_pending;
                      if (handler.state.isClickedpendingDetailedItem == true && charge != 0) {
                        TransporterTotal_pen += values_pending;
                      }
                      // Render unique fromLocations
                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`} className='avoid-word-break'>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                            <tr className="location_table_block " >
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table print-friendly" >
                                  <thead>
                                    <tr className='avoid-word-break'>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pendingItems, index) => {
                                      let pendingDate = moment(pendingItems.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pendingItems.ToAddress === toLocation && pendingItems.FromAddress === fromLocation && item[0].TruckNumber == pendingItems.Trucktype) {
                                        return (
                                          <tr className='avoid-word-break'>
                                            <td> {pendingItems.DeliveryNumber} </td>
                                            {pendingItems.RevisedTripNuber != null ?
                                              <td> {pendingItems.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pendingItems.CompanyName} </td>
                                            <td> {pendingItems.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      } else {
                        // Render subsequent rows for the same fromLocation
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`} >
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                            <tr className="location_table_block " >
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table print-friendly" >
                                  <thead>
                                    <tr className='avoid-word-break'>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pending_Item, index) => {
                                      let pendingDate = moment(pending_Item.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pending_Item.ToAddress === toLocation && pending_Item.FromAddress === fromLocation && item[0].TruckNumber == pending_Item.Trucktype) {
                                        return (
                                          <tr className='avoid-word-break'>
                                            <td> {pending_Item.DeliveryNumber} </td>
                                            {pending_Item.RevisedTripNuber != null ?
                                              <td> {pending_Item.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pending_Item.CompanyName} </td>
                                            <td> {pending_Item.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>

                        );
                      }
                    })}
                  </tbody>

                  {/* Render <tfoot> only if fromLocation changes */}
                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingItem.FromAddress === fromLocation) {
                        total += pendingItem.CHRG * pendingItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr className='avoid-word-break'>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}
                </table>
                {/* {uniqueFromLocations.length > 1 && ( */}

                <div className="total_truck_block  avoid-word-break" id={`total-trucktype-${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pending}</p>
                </div>
                {/* )} */}
              </div>
            </div>
          );
        } else {
          // Return JSX for repeated truck numbers
          // truckLength = detailedUniqueTruckNumbers.length;
          let TruckTypeLengths = key - 1;
          $("#total-trucktype-" + TruckTypeLengths + "").hide();

          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
              </div>
              <div className="col-md-10">
                <table className="table print-friendly">
                  <thead>
                    <tr className='avoid-word-break'>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render table rows */}
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {

                      const tripCount = pendingItem.count;
                      const charge = pendingItem.CHRG;
                      const values_pending = charge * tripCount;
                      const fromLocation = pendingItem.FromAddress;
                      const toLocation = pendingItem.ToAddress;
                      totalCHRG2_pending = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);
                      // TruckTypetotalValue_pending = totalCHRG2;
                      // Update values
                      locationWiseValue += values_pending;
                      // TruckTypetotalValue_pending += locationWiseValue;
                      if (handler.state.isClickedpendingDetailedItem == true && charge != 0) {
                        TransporterTotal_pen += values_pending;
                      }

                      // Render unique fromLocations
                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`} className='avoid-word-break'>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>

                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                            <tr className="location_table_block ">
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table print-friendly" >
                                  <thead>
                                    <tr className='avoid-word-break'>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pending_Item, index) => {
                                      let pendingDate = moment(pending_Item.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pending_Item.ToAddress === toLocation && pending_Item.FromAddress === fromLocation && item[0].TruckNumber == pending_Item.Trucktype) {
                                        return (
                                          <tr className='avoid-word-break'>
                                            <td> {pending_Item.DeliveryNumber} </td>
                                            {pending_Item.RevisedTripNuber != null ?
                                              <td> {pending_Item.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pending_Item.CompanyName} </td>
                                            <td> {pending_Item.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      } else {
                        // Render subsequent rows for the same fromLocation
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`} className='avoid-word-break'>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_pending}</td>
                            </tr>
                            <tr className="location_table_block ">
                              <td></td>
                              <td colSpan={4}>

                                <table className="location_table print-friendly">
                                  <thead>
                                    <tr className='avoid-word-break'>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pendingItems, index) => {
                                      let pendingDate = moment(pendingItems.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pendingItems.ToAddress === toLocation && pendingItems.FromAddress === fromLocation && item[0].TruckNumber == pendingItems.Trucktype) {
                                        return (
                                          <tr className='avoid-word-break'>
                                            <td> {pendingItems.DeliveryNumber} </td>
                                            {pendingItems.RevisedTripNuber != null ?
                                              <td> {pendingItems.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pendingItems.CompanyName} </td>
                                            <td> {pendingItems.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>

                  {/* Render <tfoot> only if fromLocation changes */}
                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingItem.FromAddress === fromLocation) {
                        total += pendingItem.CHRG * pendingItem.count;
                      }
                      return total;
                    }, 0);
                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr className='avoid-word-break'>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}

                  {/* Render "Total of Truck Type" only at the last occurrence of the truck number */}
                </table>

                <div className="total_truck_block avoid-word-break">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pending + totalCHRG2_pending}</p>
                </div>
              </div>
            </div>
          );
        }
      }
    });

    const DetailedPendingUnMatchedPDFJsx: JSX.Element[] = handler.state.PDFUnmatchedItem.map(function (item, key) {
      var locationWiseValue_pen = 0;
      var TruckTypetotalValue_pending = 0;
      var values_pending = 0;
      var charge;
      var tripCount;
      var uniqueFromLocations: any[] = [];
      var prevFromLocation: null = null;
      if (handler.state.isClickedpendingDetailedItem == true) {
        // Sort the items based on FROM_LOC
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
        if (detailedUnmatchedUniqueTruckNumbers.indexOf(item[0].TruckNumber) === -1) {
          detailedUnmatchedUniqueTruckNumbers.push(item[0].TruckNumber);
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {

                      tripCount = pendingItem.count;
                      charge = pendingItem.CHRG
                      values_pending = charge * tripCount;
                      var fromLocation = pendingItem.FromAddress;
                      var toLocation = pendingItem.ToAddress;
                      totalCHRG1_pendingUnmatch = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);


                      locationWiseValue_pen = locationWiseValue_pen + values_pending;
                      if (handler.state.isClickedpendingDetailedItem == true && charge != 0) {
                        TruckTypetotalValue_pending = TruckTypetotalValue_pending + values_pending;
                        TransporterTotal_pen = TransporterTotal_pen + values_pending;
                      }

                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }
                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>

                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pending_Items, index) => {
                                      let pendingDate = moment(pending_Items.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                      if (pending_Items.ToAddress === toLocation && pending_Items.FromAddress === fromLocation && item[0].TruckNumber == pending_Items.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {pending_Items.DeliveryNumber} </td>
                                            {pending_Items.RevisedTripNuber != null ?
                                              <td> {pending_Items.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pending_Items.CompanyName} </td>
                                            <td> {pending_Items.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>

                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }

                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>

                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pendingArrayItems, index) => {
                                      let pendingDate = moment(pendingArrayItems.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pendingArrayItems.ToAddress === toLocation && pendingArrayItems.FromAddress === fromLocation && item[0].TruckNumber == pendingArrayItems.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {pendingArrayItems.DeliveryNumber} </td>
                                            {pendingArrayItems.RevisedTripNuber != null ?
                                              <td> {pendingArrayItems.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pendingArrayItems.CompanyName} </td>
                                            <td> {pendingArrayItems.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      }
                    })}


                  </tbody>


                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingUnmatchItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingUnmatchItem.FromAddress === fromLocation) {
                        total += pendingUnmatchItem.CHRG * pendingUnmatchItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}

                </table>

                <div className="total_truck_block" id={`total-trucktype-pen${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pendingUnmatch}</p>
                </div>

              </div>
            </div>
          );
        } else {
          let TruckTypeLengthPen = key - 1;
          $("#total-trucktype-pen" + TruckTypeLengthPen + "").hide();
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                {/* <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4> */}
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.map((pendingItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {
                      tripCount = pendingItem.count;
                      charge = pendingItem.CHRG
                      values_pending = charge * tripCount;
                      var fromLocation = pendingItem.FromAddress;
                      var toLocation = pendingItem.ToAddress;
                      totalCHRG2_pendingUnmatch = item.reduce((acc: number, pendingItem: { CHRG: number; count: number; }) => acc + pendingItem.CHRG * pendingItem.count, 0);

                      locationWiseValue_pen = locationWiseValue_pen + values_pending;
                      if (handler.state.isClickedpendingDetailedItem == true && charge != 0) {
                        TruckTypetotalValue_pending = TruckTypetotalValue_pending + values_pending;
                        TransporterTotal_pen = TransporterTotal_pen + values_pending;
                      }
                      var totalformlocationcount = 5
                      if (uniqueFromLocations.indexOf(fromLocation) === -1) {
                        uniqueFromLocations.push(fromLocation);
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>

                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }
                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>

                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pending_Item, index) => {
                                      let pendingDate = moment(pending_Item.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pending_Item.ToAddress === toLocation && pending_Item.FromAddress === fromLocation && item[0].TruckNumber == pending_Item.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {pending_Item.DeliveryNumber} </td>
                                            {pending_Item.RevisedTripNuber != null ?
                                              <td> {pending_Item.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pending_Item.CompanyName} </td>
                                            <td> {pending_Item.Trucknumber}</td>
                                            <td>{pendingDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>

                              {pendingItem.trip != 0 ?
                                <td className="text-center">{tripCount}</td>
                                :
                                <td className="text-center">-</td>
                              }
                              {charge != 0 ?
                                <td className="text-end">{charge}</td>
                                :
                                <td className="text-end">-</td>
                              }

                              {values_pending != 0 ?
                                <td className="text-end">{values_pending}</td>
                                :
                                <td className="text-end">-</td>

                              }
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>

                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.pendingArrayItem.map((pendingItems, index) => {
                                      let pendinDate = moment(pendingItems.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                      if (pendingItems.ToAddress === toLocation && pendingItems.FromAddress === fromLocation && item[0].TruckNumber == pendingItems.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {pendingItems.DeliveryNumber} </td>
                                            {pendingItems.RevisedTripNuber != null ?
                                              <td> {pendingItems.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {pendingItems.CompanyName} </td>
                                            <td> {pendingItems.Trucknumber}</td>
                                            <td>{pendinDate} </td>
                                          </tr>
                                        )
                                      }
                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      }
                    })}


                  </tbody>


                  {uniqueFromLocations.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, pendingItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (pendingItem.FromAddress === fromLocation) {
                        total += pendingItem.CHRG * pendingItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value ({fromLocation}):
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}
                </table>

                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_pendingUnmatch + totalCHRG2_pendingUnmatch}</p>
                </div>
              </div>
            </div>
          );
        }
      }
    });

    // ## new code ##
    const DeliverPDFJsx: JSX.Element[] = handler.state.PDFDeliveredItem.map((item, key) => {
      var locationWiseValue_del = 0;
      var TruckTypetotalValue_del = 0;
      var values_del = 0;
      var tripCount;
      var uniqueFromLocations_del: any[] = [];
      var prevFromLocation: null = null;
      if (handler.state.isClickedDeliverDetailedItem == false) {
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));

        if (uniqueTruckNumbers_deliver.indexOf(item[0].TruckNumber) === -1) {
          uniqueTruckNumbers_deliver.push(item[0].TruckNumber);

          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>

              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item && item.map((deliverItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {
                      tripCount = deliverItem.count;
                      var charge = deliverItem.CHRG;
                      values_del = charge * tripCount;
                      var fromLocation = deliverItem.FromAddress;
                      var toLocation = deliverItem.ToAddress;

                      totalCHRG1_del = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                      locationWiseValue_del = locationWiseValue_del + values_del;
                      if (handler.state.isClickedDeliverDetailedItem == false && charge != 0) {
                        TruckTypetotalValue_del = TruckTypetotalValue_del + values_del;
                        TransporterTotal_del = TransporterTotal_del + values_del;
                      }


                      if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                        uniqueFromLocations_del.push(fromLocation);

                        return (
                          <>
                            <tr className='deliverd_items' key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr className='deliverd_items' key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverItem.FromAddress === fromLocation) {
                        total += deliverItem.CHRG * deliverItem.count;
                      }
                      return total;
                    }, 0);

                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation;
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null;
                    }
                  })}
                </table>

                <div className="total_truck_block" id={`total-trucktype-del-${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_del}</p>
                </div>
              </div>
            </div >
          );
        } else {
          let TruckTypeLength = key - 1;
          $("#total-trucktype-del-" + TruckTypeLength + "").hide();
          // $(".deliverd_items").remove();

          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2"></div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item && item.map((deliverItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {
                      tripCount = deliverItem.count;
                      var charge = deliverItem.CHRG;
                      values_del = charge * tripCount;
                      var fromLocation = deliverItem.FromAddress;
                      var toLocation = deliverItem.ToAddress;

                      totalCHRG2_del = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                      locationWiseValue_del = locationWiseValue_del + values_del;
                      if (handler.state.isClickedDeliverDetailedItem == false && charge != 0) {
                        TruckTypetotalValue_del = TruckTypetotalValue_del + values_del;
                        TransporterTotal_del = TransporterTotal_del + values_del;
                      }

                      if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                        uniqueFromLocations_del.push(fromLocation);

                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>

                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>

                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverItem.FromAddress === fromLocation) {
                        total += deliverItem.CHRG * deliverItem.count;
                      }
                      return total;
                    }, 0);

                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation;
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null;
                    }
                  })}
                </table>
                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_del + totalCHRG2_del}</p>
                </div>
              </div>
            </div>
          );
        }
      }
    });

    const DeliverUnmatchedPDFJsx: JSX.Element[] = handler.state.PDFUnmatchedItemDeliver.map(function (item, key) {
      var locationWiseValue_del = 0;
      var TruckTypetotalValue_del = 0;
      var values = 0;
      var tripCount;
      var uniqueFromLocations_del: any[] = [];
      var prevFromLocation: null = null;
      if (handler.state.isClickedDeliverDetailedItem === false) {
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
        if (unmatchedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) === -1) {
          unmatchedUniqueTruckNumbers_del.push(item[0].TruckNumber);
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      item && item.map((deliverUnmatchedItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {

                        tripCount = deliverUnmatchedItem.count;
                        var charge = deliverUnmatchedItem.CHRG
                        values = charge * tripCount; // Calculate the value
                        var fromLocation = deliverUnmatchedItem.FromAddress;
                        var toLocation = deliverUnmatchedItem.ToAddress;
                        // values = deliverUnmatchedItem.Charge * tripcount; // Calculate the value
                        totalCHRG1_deliverUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                        locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue

                        if (handler.state.isClickedDeliverDetailedItem == false && charge != 0) {
                          TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                          TransporterTotal_del = TransporterTotal_del + values;
                        }

                        if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                          // This is a new unique fromLocation, so add it to the array
                          uniqueFromLocations_del.push(fromLocation);

                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td>{fromLocation}</td>
                                <td>{toLocation}</td>

                                {deliverUnmatchedItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }
                              </tr>

                            </>
                          );
                        } else {
                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td></td>
                                <td>{toLocation}</td>

                                {deliverUnmatchedItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>

                            </>
                          );
                        }

                      })}
                  </tbody>
                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverUnmatchItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverUnmatchItem.FromAddress === fromLocation) {
                        total += deliverUnmatchItem.CHRG * deliverUnmatchItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}


                </table>

                {/* {uniqueFromLocations_del.length > 1 && ( */}
                <div className="total_truck_block" id={`total-trucktype-deliver${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_deliverUnmatch}</p>
                </div>
                {/* )} */}

              </div>
            </div>
          )
        } else {
          let TruckTypeLengthDel = key - 1;
          $("#total-trucktype-deliver" + TruckTypeLengthDel + "").hide();
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      item && item.map((deliverItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {

                        tripCount = deliverItem.count;
                        var charge = deliverItem.CHRG
                        values = charge * tripCount; // Calculate the value
                        var fromLocation = deliverItem.FromAddress;
                        var toLocation = deliverItem.ToAddress;
                        // values = deliverItem.Charge * tripcount; // Calculate the value
                        totalCHRG2_deliverUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                        locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue
                        if (handler.state.isClickedDeliverDetailedItem == false && charge != 0) {
                          TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                          TransporterTotal_del = TransporterTotal_del + values;
                        }

                        if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                          // This is a new unique fromLocation, so add it to the array
                          uniqueFromLocations_del.push(fromLocation);

                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td>{fromLocation}</td>
                                <td>{toLocation}</td>

                                {deliverItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td></td>
                                <td>{toLocation}</td>

                                {deliverItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>
                              {/* <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>

                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.deliverArrayItem.map((deliverArray_Items, index) => {

                                      let deliverDate = moment(deliverArray_Items.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                      if (deliverArray_Items.ToAddress === toLocation && deliverArray_Items.FromAddress === fromLocation && item[0].TruckNumber == deliverArray_Items.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {deliverArray_Items.DeliveryNumber} </td>
                                            {deliverArray_Items.RevisedTripNuber != null ?
                                              <td> {deliverArray_Items.RevisedTripNuber} </td>
                                              :
                                              <td> - </td>}
                                            <td> {deliverArray_Items.CompanyName} </td>
                                            <td> {deliverArray_Items.Trucknumber}</td>
                                            <td>{deliverDate} </td>
                                          </tr>
                                        )
                                      }


                                    })}

                                  </tbody>
                                </table>
                              </td>
                            </tr> */}
                            </>
                          );
                        }

                      })}
                  </tbody>


                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverItem.FromAddress === fromLocation) {
                        total += deliverItem.CHRG * deliverItem.count;
                      }
                      return total;
                    }, 0);
                    // TruckTypetotalValue_pending += locationTotal;

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}

                </table>


                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_deliverUnmatch + totalCHRG2_deliverUnmatch}</p>
                </div>

              </div>
            </div>
          )
        }
      }
    });

    // ## new code ##
    const DetailedDeliverPDFJsx: JSX.Element[] = handler.state.PDFDeliveredItem.map((item, key) => {
      var locationWiseValue_del = 0;
      var TruckTypetotalValue_del = 0;
      var values_del = 0;
      var tripCount;
      var uniqueFromLocations_del: any[] = [];
      var prevFromLocation: null = null;
      if (handler.state.isClickedDeliverDetailedItem == true) {
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));

        if (detailedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) === -1) {
          detailedUniqueTruckNumbers_del.push(item[0].TruckNumber);

          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item && item.map((deliverItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {
                      tripCount = deliverItem.count;
                      var charge = deliverItem.CHRG;
                      values_del = charge * tripCount;
                      var fromLocation = deliverItem.FromAddress;
                      var toLocation = deliverItem.ToAddress;

                      totalCHRG1_del = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                      locationWiseValue_del = locationWiseValue_del + values_del;
                      if (handler.state.isClickedDeliverDetailedItem == true && charge != 0) {
                        TruckTypetotalValue_del = TruckTypetotalValue_del + values_del; // Accumulate TruckTypetotalValue
                        TransporterTotal_del = TransporterTotal_del + values_del;
                      }

                      if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                        uniqueFromLocations_del.push(fromLocation);

                        return (
                          <>
                            <tr className='deliverd_items' key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.deliverArrayItem.map((deliverArray_Item1, index) => {
                                      let deliverDate = moment(deliverArray_Item1.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                      if (deliverArray_Item1.ToAddress === toLocation && deliverArray_Item1.FromAddress === fromLocation && item[0].TruckNumber == deliverArray_Item1.Trucktype) {
                                        return (
                                          <tr >
                                            <td> {deliverArray_Item1.DeliveryNumber} </td>
                                            {deliverArray_Item1.RevisedTripNuber != null ?
                                              <td> {deliverArray_Item1.RevisedTripNuber} </td> :
                                              <td> - </td>}
                                            <td> {deliverArray_Item1.CompanyName} </td>
                                            <td> {deliverArray_Item1.Trucknumber}</td>
                                            <td>{deliverDate} </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.deliverArrayItem.map((deliverItems1, index) => {
                                      let deliverDate = moment(deliverItems1.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                      if (deliverItems1.ToAddress === toLocation && deliverItems1.FromAddress === fromLocation && item[0].TruckNumber == deliverItems1.Trucktype) {
                                        return (
                                          <tr >
                                            <td> {deliverItems1.DeliveryNumber} </td>
                                            {deliverItems1.RevisedTripNuber != null ?
                                              <td> {deliverItems1.RevisedTripNuber} </td> :
                                              <td> - </td>}
                                            <td> {deliverItems1.CompanyName} </td>
                                            <td> {deliverItems1.Trucknumber}</td>
                                            <td>{deliverDate} </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverItem.FromAddress === fromLocation) {
                        total += deliverItem.CHRG * deliverItem.count;
                      }
                      return total;
                    }, 0);

                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation;
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null;
                    }
                  })}
                </table>
                <div className="total_truck_block" id={`total-trucktype-del-${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_del}</p>
                </div>
              </div>
            </div>
          );
        } else {
          let TruckTypeLength = key - 1;
          $("#total-trucktype-del-" + TruckTypeLength + "").hide();
          // $(".deliverd_items").remove();

          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">

              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item && item.map((deliverItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; }, index: any) => {
                      tripCount = deliverItem.count;
                      var charge = deliverItem.CHRG;
                      values_del = charge * tripCount;
                      var fromLocation = deliverItem.FromAddress;
                      var toLocation = deliverItem.ToAddress;

                      totalCHRG2_del = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                      locationWiseValue_del = locationWiseValue_del + values_del;
                      if (charge != 0) {
                        TruckTypetotalValue_del = TruckTypetotalValue_del + values_del; // Accumulate TruckTypetotalValue
                        TransporterTotal_del = TransporterTotal_del + values_del;
                      }

                      if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                        uniqueFromLocations_del.push(fromLocation);

                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td>{fromLocation}</td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.deliverArrayItem.map((deliver_Items1, index) => {
                                      let deliverDate = moment(deliver_Items1.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                      if (deliver_Items1.ToAddress === toLocation && deliver_Items1.FromAddress === fromLocation && item[0].TruckNumber == deliver_Items1.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {deliver_Items1.DeliveryNumber} </td>
                                            {deliver_Items1.RevisedTripNuber != null ?
                                              <td> {deliver_Items1.RevisedTripNuber} </td> :
                                              <td> - </td>}
                                            <td> {deliver_Items1.CompanyName} </td>
                                            <td> {deliver_Items1.Trucknumber}</td>
                                            <td>{deliverDate} </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <tr key={`group-${index}-from-${fromLocation}`}>
                              <td></td>
                              <td>{toLocation}</td>
                              <td className="text-center">{tripCount}</td>
                              <td className="text-end">{charge}</td>
                              <td className="text-end">{values_del}</td>
                            </tr>
                            <tr className="location_table_block">
                              <td></td>
                              <td colSpan={4}>
                                <table className="location_table">
                                  <thead>
                                    <tr>
                                      <th> DN Number </th>
                                      <th> Revised Trip Number</th>
                                      <th> Customer Name </th>
                                      <th> Truck Number </th>
                                      <th className="TD_date_th"> Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {handler.state.deliverArrayItem.map((deliver_Items, index) => {
                                      let deliverDate = moment(deliver_Items.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                      if (deliver_Items.ToAddress === toLocation && deliver_Items.FromAddress === fromLocation && item[0].TruckNumber == deliver_Items.Trucktype) {
                                        return (
                                          <tr>
                                            <td> {deliver_Items.DeliveryNumber} </td>
                                            {deliver_Items.RevisedTripNuber != null ?
                                              <td> {deliver_Items.RevisedTripNuber} </td> :
                                              <td> - </td>}
                                            <td> {deliver_Items.CompanyName} </td>
                                            <td> {deliver_Items.Trucknumber}</td>
                                            <td>{deliverDate} </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        );
                      }
                    })}
                  </tbody>
                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverItem.FromAddress === fromLocation) {
                        total += deliverItem.CHRG * deliverItem.count;
                      }
                      return total;
                    }, 0);

                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation;
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null;
                    }
                  })}
                </table>
                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_del + totalCHRG2_del}</p>
                </div>
              </div>
            </div>
          );
        }
      }
    });

    const DetailedDeliverUnmatchedPDFJsx: JSX.Element[] = handler.state.PDFUnmatchedItemDeliver.map(function (item, key) {
      var locationWiseValue_del = 0;
      var TruckTypetotalValue_del = 0;
      var values = 0;
      var tripCount;
      var uniqueFromLocations_del: any[] = [];
      var prevFromLocation: null = null;
      if (handler.state.isClickedDeliverDetailedItem == true) {
        item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
        if (detailedUnmatchedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) === -1) {
          detailedUnmatchedUniqueTruckNumbers_del.push(item[0].TruckNumber);
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      item && item.map((deliverUnmatchedItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {

                        tripCount = deliverUnmatchedItem.count;
                        var charge = deliverUnmatchedItem.CHRG
                        values = charge * tripCount; // Calculate the value
                        var fromLocation = deliverUnmatchedItem.FromAddress;
                        var toLocation = deliverUnmatchedItem.ToAddress;
                        // values = deliverUnmatchedItem.Charge * tripcount; // Calculate the value
                        totalCHRG1_deliverUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                        locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue
                        if (handler.state.isClickedDeliverDetailedItem == true && charge != 0) {
                          TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                          TransporterTotal_del = TransporterTotal_del + values;
                        }

                        if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                          // This is a new unique fromLocation, so add it to the array
                          uniqueFromLocations_del.push(fromLocation);

                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td>{fromLocation}</td>
                                <td>{toLocation}</td>

                                {deliverUnmatchedItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>
                              <tr className="location_table_block">
                                <td></td>
                                <td colSpan={4}>

                                  <table className="location_table">
                                    <thead>
                                      <tr>
                                        <th> DN Number </th>
                                        <th> Revised Trip Number</th>
                                        <th> Customer Name </th>
                                        <th> Truck Number </th>
                                        <th className="TD_date_th"> Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {handler.state.deliverArrayItem.map((deliverItems2, index) => {
                                        let deliverDate = moment(deliverItems2.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                        if (deliverItems2.ToAddress === toLocation && deliverItems2.FromAddress === fromLocation && item[0].TruckNumber == deliverItems2.Trucktype) {
                                          return (
                                            <tr>
                                              <td> {deliverItems2.DeliveryNumber} </td>
                                              {deliverItems2.RevisedTripNuber != null ?
                                                <td> {deliverItems2.RevisedTripNuber} </td>
                                                :
                                                <td> - </td>}
                                              <td> {deliverItems2.CompanyName} </td>
                                              <td> {deliverItems2.Trucknumber}</td>
                                              <td>{deliverDate} </td>
                                            </tr>
                                          )
                                        }
                                      })}

                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td></td>
                                <td>{toLocation}</td>

                                {deliverUnmatchedItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>
                              <tr className="location_table_block">
                                <td></td>
                                <td colSpan={4}>

                                  <table className="location_table">
                                    <thead>
                                      <tr>
                                        <th> DN Number </th>
                                        <th> Revised Trip Number</th>
                                        <th> Customer Name </th>
                                        <th> Truck Number </th>
                                        <th className="TD_date_th"> Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {handler.state.deliverArrayItem.map((deliverArrayItems3, index) => {
                                        let deliverDate = moment(deliverArrayItems3.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                        if (deliverArrayItems3.ToAddress === toLocation && deliverArrayItems3.FromAddress === fromLocation && item[0].TruckNumber == deliverArrayItems3.Trucktype) {
                                          return (
                                            <tr>
                                              <td> {deliverArrayItems3.DeliveryNumber} </td>
                                              {deliverArrayItems3.RevisedTripNuber != null ?
                                                <td> {deliverArrayItems3.RevisedTripNuber} </td>
                                                :
                                                <td> - </td>}
                                              <td> {deliverArrayItems3.CompanyName} </td>
                                              <td> {deliverArrayItems3.Trucknumber}</td>
                                              <td>{deliverDate} </td>
                                            </tr>
                                          )
                                        }
                                      })}

                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </>
                          );
                        }

                      })}
                  </tbody>
                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverUnmatchItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverUnmatchItem.FromAddress === fromLocation) {
                        total += deliverUnmatchItem.CHRG * deliverUnmatchItem.count;
                      }
                      return total;
                    }, 0);

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}
                </table>
                {/* {uniqueFromLocations_del.length > 1 && ( */}
                <div className="total_truck_block" id={`total-trucktype-deliver-${key}`}>
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_deliverUnmatch}</p>
                </div>
                {/* )} */}

              </div>
            </div>
          )
        } else {
          let TruckTypeLengthDel = key - 1;
          $("#total-trucktype-deliver-" + TruckTypeLengthDel + "").hide();
          return (
            <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
              <div className="col-md-2">
                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
                {Transporter_Selected == "-" &&
                  <p>Transporter: {item[0].transporterName}</p>
                }
              </div>
              <div className="col-md-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="from_location"> From Location </th>
                      <th className="to_location"> To Location </th>
                      <th className="trips text-center"> Trips </th>
                      <th className="charges text-end"> Charges </th>
                      <th className="values text-end"> Value </th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      item && item.map((deliverItem: { count: any; CHRG: any; FromAddress: any; ToAddress: any; trip: number; }, index: any) => {
                        tripCount = deliverItem.count;
                        var charge = deliverItem.CHRG
                        values = charge * tripCount; // Calculate the value
                        var fromLocation = deliverItem.FromAddress;
                        var toLocation = deliverItem.ToAddress;
                        // values = deliverItem.Charge * tripcount; // Calculate the value
                        totalCHRG2_deliverUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                        locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue
                        if (charge != 0) {
                          TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                          TransporterTotal_del = TransporterTotal_del + values;
                        }

                        if (uniqueFromLocations_del.indexOf(fromLocation) === -1) {
                          // This is a new unique fromLocation, so add it to the array
                          uniqueFromLocations_del.push(fromLocation);

                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td>{fromLocation}</td>
                                <td>{toLocation}</td>

                                {deliverItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>
                              <tr className="location_table_block">
                                <td></td>
                                <td colSpan={4}>

                                  <table className="location_table">
                                    <thead>
                                      <tr>
                                        <th> DN Number </th>
                                        <th> Revised Trip Number</th>
                                        <th> Customer Name </th>
                                        <th> Truck Number </th>
                                        <th className="TD_date_th"> Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {handler.state.deliverArrayItem.map((deliveredItem, index) => {
                                        let deliverDate = moment(deliveredItem.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")
                                        if (deliveredItem.ToAddress === toLocation && deliveredItem.FromAddress === fromLocation && item[0].TruckNumber == deliveredItem.Trucktype) {
                                          return (
                                            <tr>
                                              <td> {deliveredItem.DeliveryNumber} </td>
                                              {deliveredItem.RevisedTripNuber != null ?
                                                <td> {deliveredItem.RevisedTripNuber} </td>
                                                :
                                                <td> - </td>}
                                              <td> {deliveredItem.CompanyName} </td>
                                              <td> {deliveredItem.Trucknumber}</td>
                                              <td>{deliverDate} </td>
                                            </tr>
                                          )
                                        }
                                      })}

                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <tr key={`group-${index}-from-${fromLocation}`}>
                                <td></td>
                                <td>{toLocation}</td>

                                {deliverItem.trip != 0 ?
                                  <td className="text-center">{tripCount}</td>
                                  :
                                  <td className="text-center">-</td>
                                }
                                {charge != 0 ?
                                  <td className="text-end">{charge}</td>
                                  :
                                  <td className="text-end">-</td>
                                }
                                {values != 0 ?
                                  <td className="text-end">{values}</td>
                                  :
                                  <td className="text-end">-</td>

                                }

                              </tr>
                              <tr className="location_table_block">
                                <td></td>
                                <td colSpan={4}>

                                  <table className="location_table">
                                    <thead>
                                      <tr>
                                        <th> DN Number </th>
                                        <th> Revised Trip Number</th>
                                        <th> Customer Name </th>
                                        <th> Truck Number </th>
                                        <th className="TD_date_th"> Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {handler.state.deliverArrayItem.map((deliverArray_Items, index) => {

                                        let deliverDate = moment(deliverArray_Items.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A")

                                        if (deliverArray_Items.ToAddress === toLocation && deliverArray_Items.FromAddress === fromLocation && item[0].TruckNumber == deliverArray_Items.Trucktype) {
                                          return (
                                            <tr>
                                              <td> {deliverArray_Items.DeliveryNumber} </td>
                                              {deliverArray_Items.RevisedTripNuber != null ?
                                                <td> {deliverArray_Items.RevisedTripNuber} </td>
                                                :
                                                <td> - </td>}
                                              <td> {deliverArray_Items.CompanyName} </td>
                                              <td> {deliverArray_Items.Trucknumber}</td>
                                              <td>{deliverDate} </td>
                                            </tr>
                                          )
                                        }


                                      })}

                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </>
                          );
                        }

                      })}
                  </tbody>


                  {uniqueFromLocations_del.map((fromLocation) => {
                    const locationTotal = item.reduce((total: number, deliverItem: { FromAddress: any; CHRG: number; count: number; }) => {
                      if (deliverItem.FromAddress === fromLocation) {
                        total += deliverItem.CHRG * deliverItem.count;
                      }
                      return total;
                    }, 0);
                    // TruckTypetotalValue_pending += locationTotal;

                    // Check if fromLocation is different from the previous one
                    if (fromLocation !== prevFromLocation) {
                      prevFromLocation = fromLocation; // Update the previous fromLocation
                      return (
                        <tfoot key={`total-for-${fromLocation}`}>
                          <tr>
                            <td> </td>
                            <td colSpan={3} className="truck_value">
                              Total of from Location wise Truck Value :
                            </td>
                            <td className="text-end">{locationTotal !== 0 ? locationTotal : '-'}</td>
                          </tr>
                        </tfoot>
                      );
                    } else {
                      return null; // Return null if fromLocation is the same
                    }
                  })}

                </table>


                <div className="total_truck_block">
                  <p className="total_truck"> Total of Truck Type : </p>
                  <p className="total_truck_value">{totalCHRG1_deliverUnmatch + totalCHRG2_deliverUnmatch}</p>
                </div>

              </div>
            </div>
          )
        }
      }
    });

    const databledatajsx: JSX.Element[] = handler.state.Items.map(function (item, key) {
      var completiondate = moment(item.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD")
      const remarkValue = item.Remarks || "";
      return (
        <tr>
          <td>{item.DeliveryNumber}</td>
          <td>{item.TripNumber}</td>
          <td>{item.RevisedTripNuber == null ? "-" : item.RevisedTripNuber}</td>
          {/* <td>{moment(item.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm")}</td> */}
          <td>{moment(item.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm")}</td>
          <td className='word_break'>{item.CompanyName == null ? "-" : item.CompanyName}</td>
          <td className='word_break'>{item.FromAddress == null ? "-" : item.FromAddress}</td>
          <td className='word_break'>{item.ToAddress == null ? "-" : item.ToAddress}</td>
          <td>{item.Trucktype == null ? "-" : item.Trucktype}</td>
          <td>{item.Trucknumber == null ? "-" : item.Trucknumber}</td>
          <td className='word_break'>{item.DriverName == null ? "-" : item.DriverName}</td>
          <td className={`status text-center ${item.DNDashBoardDeliveryStatus.toLowerCase()} `}>{item.DNDashBoardDeliveryStatus}</td>
          {item.DNDashBoardDeliveryStatus.toLowerCase() == "delivered" ?
            <td>{moment(item.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm")}</td>
            :
            <td>-</td>
          }
          <td className='clickhere_td'>{item.DNEIDURL == null ?
            "-"
            :
            <a target="_blank" data-interception="off" href={`${item.DNEIDURL.Url}`}>Click Here</a>
          }
          </td>
          <td className="uploadstampeddn">
            {item.DNDashBoardDeliveryStatus == "Pending" &&
              <div className="image-upload">
                <button type='button' className='uploadfile' onClick={(e) => handler.Uploadfile(e, "Attached", item.ID, item.DeliveryNumber)}>
                  <img src="https://balmerlawries.sharepoint.com/sites/Dn-Transport/SiteAssets/Images/uploadimg.svg" data-themekey="#" />
                  <span> Upload </span>
                </button>
              </div>
            }
            {item.DNDashBoardDeliveryStatus == "Inprogress" &&
              <div className="image-upload btn_disable">
                <button type='button' className='uploadfile'>
                  <img src="https://balmerlawries.sharepoint.com/sites/Dn-Transport/SiteAssets/Images/uploadimg.svg" data-themekey="#" />
                  <span> Upload </span>
                </button>
              </div>
            }
            {item.DNDashBoardDeliveryStatus == "Rejected" &&
              <div className="image-upload">
                <button type='button' className='uploadfile' onClick={(e) => handler.Uploadfile(e, "Attached", item.ID, item.DeliveryNumber)}>
                  <img src="https://balmerlawries.sharepoint.com/sites/Dn-Transport/SiteAssets/Images/uploadimg.svg" data-themekey="#" />
                  <span> Upload </span>
                </button>
              </div>
            }
            {item.DNDashBoardDeliveryStatus == "Delivered" &&
              <div>
                <span>Delivered</span>
              </div>
            }
          </td>
          <td className={`remark_td-${key} ${remarkValue != "" ? 'remarks_view' : ''}`}>
            <div className='remarks_block'>
              <div
                className={`txt_remarks-${key} remarks_text`}
                id={`remarks-${key}`}
                contentEditable={remarkValue == ""}  // Editable if remarkValue is empty
                // contentEditable={`${remarkValue !="" ? false : true} `}
                // suppressContentEditableWarning={true}
                onInput={(e) => handler.handleInputChange(e, key, remarkValue)}
              >
                {Remarks[key] !== undefined ? Remarks[key] : remarkValue}
              </div>
              <p className={`remarks_tooltip remarks_tooltip_${key}`} id={`remarks_tooltip_${key}`}>
                {Remarks[key] !== undefined ? Remarks[key] : remarkValue}
              </p>
            </div>
            <ul className="remarks_img">
              <li>
                <a href="#" onClick={(e) => handler.handleRemarksEdit(e, item.ID, key)}>
                  <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/edit.svg" className="edit_img" data-themekey="#" />
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handler.handleRemarksDelete(e, item.ID, key)}>
                  <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/delete.svg" className="delete_img" data-themekey="#" />
                </a>
              </li>
            </ul>
            <button style={{ display: "none" }} className={`remark_btn-${key} remarks_submit_btn`} onClick={(e) => handler.handleRemarksSubmit(e, item.ID, key, `remarks_tooltip_${key}`, remarkValue)}>Submit</button>
          </td>
        </tr>
      );

    })

    return (
      <>
        {
          this.state.isTransporterDashboard == true &&
          <div className={styles.dnTransporterDashboard} >
            <header className="attachement_header">
              <div className="container">
                <div className="header_first_section ">
                  <div className="logo">
                    <a href=""><img src="https://balmerlawries.sharepoint.com/sites/Corporate/Artwork/SiteAssets/ArtWorkFolderCreation/img/logo_img.svg" alt="img" /></a>
                  </div>
                  <div className="notification-part">
                    <ul className="header-ul">
                      {/* <li> <a href="" className="relative"> <img className="notification_img" src="https://tmxin.sharepoint.com/sites/POC/ClientPOC/SupplierPortal/SiteAssets/Supplier%20Portal%20Assets/img/notification.svg" alt="img" /> <span className="noto-count"> 1 </span> </a> </li> */}
                      <li className="image"> <img className="user_img" src={`https://balmerlawries.sharepoint.com/sites/Corporate/Artwork/_layouts/15/userphoto.aspx?&username=${this.state.CurrentUserEmail}`} alt="img" /> </li>
                      {/* <li className="person-details"> <img className="user_img" src="https://tmxin.sharepoint.com/sites/POC/ClientPOC/SupplierPortal/SiteAssets/Supplier%20Portal%20Assets/img/user.png" alt="img" /> */}
                      <li> {this.state.CurrentLoggedinuserNameState}  </li>
                      <li className="dropdown-li" title="Open Menu" > <img onClick={this.signOut} src="https://balmerlawries.sharepoint.com/sites/Corporate/Artwork/SiteAssets/ArtWorkFolderCreation/img/next.png" className="next_img" alt="img" />
                      </li>
                      <li className="SignOut-li">
                        <a href="https://login.microsoftonline.com/common/oauth2/logout">Sign Out</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </header>
            <section id="Load_content">
              <div className="container invoice_container">
                <div className='DN_heading'>
                  <div className="table_heading clearfix">
                    <h2> DN Dashboard </h2>
                  </div>
                  <div className="bread-crums-part-btn-ctrols">
                    <div className="bread-crums-part clearfix">
                      <ul className="bread-crums-left">
                        <li>
                          <ul className='dn_dash_header clearfix'>
                            <li className='Transporter'> <a href="#">Transporter </a>  </li>
                            <li onClick={() => this.gotoBilligDashboard()} className="Billing"> <a href="#">Billing </a> </li>
                          </ul>
                        </li>
                        {this.state.IsCurrentUserIsAdmin ?
                          <li className='transporter_name' style={{ float: "right", marginTop: "-20px" }}>
                            <label className="">Transporter Name:</label>
                            <select
                              value={selectedTransporter || ''}
                              onChange={(e) => this.setSelectedTransporter(e, e.target.value)}>
                              <option value="">Select Transporter</option>
                              {transporterList.map((transporter) => (
                                <option key={transporter.id} value={transporter.name}>
                                  {transporter.name}
                                </option>
                              ))}
                            </select>
                          </li>
                          :
                          <li className='transporter_name' style={{ float: "right", marginTop: "-20px" }}><a href='#'>Transporter Name: {Transporter_Selected}</a></li>
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="three-blocks-wrap">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="three-blocks">
                        <div className="three-blocks-img">
                          <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/total.svg" alt="image"></img>
                        </div>
                        <div className="three-blocks-desc">
                          <h3> {this.state.TotalEntries} </h3>
                          <p> Total </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="three-blocks">
                        <div className="three-blocks-img">
                          <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Approved.svg" alt="image"></img>
                        </div>
                        <div className="three-blocks-desc">
                          <h3> {this.state.TotalDelivered} </h3>
                          <p> Total Delivered </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="three-blocks">
                        <div className="three-blocks-img">
                          <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/pending.svg" alt="image"></img>
                        </div>
                        <div className="three-blocks-desc">
                          <h3> {this.state.TotalPending} </h3>
                          <p> Total Pending </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="three-blocks">
                        <div className="three-blocks-img">
                          <img src="https://balmerlawries.sharepoint.com/sites/Dn-Transport/SiteAssets/Images/inprogress.svg" alt="image"></img>
                        </div>
                        <div className="three-blocks-desc">
                          <h3> {this.state.TotalInprogress} </h3>
                          <p> Total Inprogress </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="three-blocks">
                        <div className="three-blocks-img">
                          <img src="https://balmerlawries.sharepoint.com/sites/Dn-Transport/SiteAssets/Images/rejected.svg" alt="image"></img>
                        </div>
                        <div className="three-blocks-desc">
                          <h3> {this.state.TotalRejected} </h3>
                          <p> Total Rejected </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="popup_banner">
                  <div className="popup_div">
                    <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/close.svg" onClick={(e) => this.closepopup(e)} className="popup_cancel" data-themekey="#" />
                    <h2> Stamped DN </h2>
                    <div className="image-upload1" onDrop={(e) => this.handleDrop(e)}
                      onDragOver={(e) => this.handleDragOver(e)}>
                      <label htmlFor="uploadfilesdata" className="img-uploads">
                        <a href="#"> <img src="https://balmerlawries.sharepoint.com/sites/Dn-Transport/SiteAssets/Images/uploadimg.svg" className="upload_file" data-themekey="#" /> </a>
                        <h5> Choose an file or drag it here. </h5>
                      </label>
                      <input id="uploadfilesdata" className="uploadFile" name="file-upload" type="file" onChange={(e) => this.handleFiles(e)} />
                      {/* <button id="uploadfilesdata" className="uploadFile")}></button> */}
                    </div>
                    <div className="dnfile">
                      <ul id="attachdnfile">
                      </ul>
                    </div>
                    <div className="dn_btn">
                      <button id="uploadfilesdata" className="submit_btn" onClick={(e) => this.Uploadfile(e, "Submitted", "", "")}>Submit</button>
                      <button className="cancel_btn" onClick={(e) => this.closepopup(e)}>Cancel</button>
                    </div>
                  </div>
                </div>
                <div className='table_block'>
                  <div className='clearfix all_btn_block'>
                    <div className='from_to_transporter_block'>
                      <ul className='clearfix left_part'>
                        <li>
                          {/* <label className="">From</label> */}
                          <input
                            type="date"
                            id="txt-current-date"
                            className="form-control startdate"
                            autoComplete="off"
                            // placeholder="Select Start Date"
                            value={moment(this.state.startDate).format('YYYY-MM-DD')}
                            min="2024-02-01"
                            max={moment(this.state.endDate).format('YYYY-MM-DD')}
                            onChange={this.handleStartDateChange}
                          />
                        </li>
                        <li>
                          {/* <label className="">To</label> */}
                          <input
                            type="date"
                            id="txt-end-date"
                            className="form-control enddate"
                            autoComplete="off"
                            // placeholder="Select End Date"
                            value={moment(this.state.endDate).format('YYYY-MM-DD')}
                            min={moment(this.state.startDate).format('YYYY-MM-DD')}
                            max={moment().format('YYYY-MM-DD')}
                            // onFocus={this.handleEndDateFocus}
                            onChange={this.handleEndDateChange}
                            disabled={!this.state.startDateSelected} // Disable the end date input if start date is not selected
                          />
                        </li>
                        {/* <li className='apply_dates btn_disable'> */}
                        <li className={`apply_dates ${!this.state.startDateSelected ? 'btn_disable' : ''}`}>
                          <button onClick={(e) => this.Submitdates(e)}>Apply</button>
                        </li>
                        <li>
                          <div className='select_report_btn'>
                            <select id="reportDropdown" onChange={(e) =>this.handleReportSelection(e)} value={selectedReport || ''}>
                              <option value="">PDF Reports</option>
                              <option value="summary" >  Summary Report </option>
                              <option value="exception" >  Exception Report </option>
                              <option value="summaryDetailed" > Summary Detailed Report  </option>
                              <option value="exceptionDetailed" >Exception Detailed Report </option>
                              <option value="consolidatedpdf" >Consolidated PDF Report</option>
                            </select>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className='right_part'>
                      <ul className='clearfix'>
                        <li onClick={this.exportToExcel} >
                          <button type='button' className="export_btn" >
                            <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/excel.svg" alt="Image" data-themekey="#"></img>Download
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-responsive">
                    {this.state.Items.length == 0 &&
                      <ul className="empty_db">
                        <li className="sort_part">
                          <div className="dataTables_length" id="DNTable_length">
                            <label>Show <select name="DNTable_length" aria-controls="DNTable" className="" disabled>
                              <option value="-1">All</option>
                            </select> entries</label>
                          </div></li>
                        <li className="search_part">
                          <div id="DNTable_filter" className="dataTables_filter">
                            <label><input type="search" className="" placeholder="Search here..." aria-controls="DNTable" /></label>
                          </div>
                        </li>
                      </ul>
                    }
                    <table className="table my-dntable" id="DNTable">
                      {this.state.Items.length != 0 &&
                        <thead>
                          <tr>
                            <th className="deliverynumber" id='DeliveryNumber'>DN Number</th>
                            <th className="tripnumber" id='TripNumber'>Trip Number</th>
                            <th id='RevisedTripNuber'>Revised Trip No.</th>
                            <th className="createdon" id='ActualCreatedDatewithTime'>Date</th>
                            <th className="companyname" id='CompanyName'>Customer Name</th>
                            <th className="fromaddress" id='FromAddress'>From Location</th>
                            <th className="toaddress" id='ToAddress'>To Location</th>
                            <th className="trucktype" id='Trucktype'>Truck Type</th>
                            <th className="trucknumber" id='Trucknumber'>Truck Number</th>
                            <th className="drivername" id='DriverName'>Driver Name</th>
                            <th className="delivery_status" id='DNDashBoardDeliveryStatus'>Status</th>
                            <th className="modified" id='ActualModifiedDateTime'>Completion Date</th>
                            <th className="signeddncopyurl">Stamped DN</th>
                            <th className="uploadstampeddn">Upload Stamped DN</th>
                            <th className="remarks">Remarks</th>
                          </tr>
                        </thead>
                      }
                      <thead id="Column_heading" className="display nowrap" >
                        <tr>
                          <th className="deliverynumber">DN Number</th>
                          <th className="tripnumber">Trip Number</th>
                          <th>Revised Trip No.</th>
                          <th className="createdon">Date</th>
                          <th className="companyname">Customer Name</th>
                          <th className="fromaddress">From Location</th>
                          <th className="toaddress">To Location</th>
                          <th className="trucktype">Truck Type</th>
                          <th className="trucknumber">Truck Number</th>
                          <th className="drivername">Driver Name</th>
                          <th className="delivery_status">Status</th>
                          <th className="modified">Completion Date</th>
                          <th className="signeddncopyurl">Stamped DN</th>
                          <th className="uploadstampeddn">Upload Stamped DN</th>
                          <th className="remarks">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className='DNTableBody' id="DNTabletbody">
                        {databledatajsx}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div id='pdf-margin' style={{ marginTop: "500px", display: "none" }}></div>
              <div id='pendingPdf-detail' className='pendingPdf-details ' style={{ display: "none" }} >
                <header className="attachement_header header_toshow" id='header'>
                  <div className="container">
                    <div className="header_first_section  ">
                      <div className="logo">
                        <a href=""> <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/logo_img.svg" alt="img" /></a>
                      </div>
                      <div className="notification-part">
                        <p className="date"> Date : <span> {moment().format('DD-MMM-YY HH:mm')} </span> </p>
                      </div>
                    </div>
                  </div>
                </header>
                <section className="attachement_section">
                  <div className="container">
                    <div className="transport_trip_details_banner ">
                      <h2 className='header_toshow'> TRANSPORTER DETAILED EXCEPTION  </h2>
                      <div className="transport_trip_details ">
                        <div className="heading clearfix header_toshow">
                          {Transporter_Selected == "-" ?
                            <h4> Transporter- <span>  ALL </span> </h4>
                            :
                            <h4> Transporter- <span>  {Transporter_Selected} </span> </h4>
                          }
                        </div>
                        {handler.state.isClickedpendingDetailedItem === true &&
                          <div>
                            {DetailedPendingMatchedPDFJsx}
                            {DetailedPendingUnMatchedPDFJsx}
                          </div>
                        }
                        <div className="total_truck_block transport_totalvalue_block footer_show">
                          <p className="total_truck"> Transporter Total : </p>
                          {this.state.TotalPending < 600 &&
                            <p className="total_truck_value"> {TransporterTotal_pen}</p>
                          }
                          {this.state.TotalPending > 600 &&
                            <p className="total_truck_value"> {MasterArray}</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </section >
              </div>
              <div id='pendingPdf' className='pendingPdf' style={{ display: "none" }} >
                <header className="attachement_header" id='header'>
                  <div className="container">
                    <div className="header_first_section ">
                      <div className="logo">
                        <a href=""> <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/logo_img.svg" alt="img" /></a>
                      </div>
                      <div className="notification-part">
                        <p className="date"> Date : <span> {moment().format('DD-MMM-YY HH:mm')} </span> </p>
                      </div>
                    </div>
                  </div>
                </header>
                <section className="attachement_section">
                  <div className="container">
                    <div className="transport_trip_details_banner ">
                      <h2> TRANSPORTER  EXCEPTION  </h2>
                      <div className="transport_trip_details">
                        <div className="heading clearfix">
                          {Transporter_Selected == "-" ?
                            <h4> Transporter- <span>  ALL </span> </h4>
                            :
                            <h4> Transporter- <span>  {Transporter_Selected} </span> </h4>
                          }
                          {/* <p> Transport Trip-Details For the Month - <span className="month"> {selectedDate} </span> </p> */}
                        </div>
                        {handler.state.isClickedpendingDetailedItem === false &&
                          <div>
                            {PendingMatchedPDFJsx}
                            {PendingUnMatchedPDFJsx}
                          </div>
                        }
                        <div className="total_truck_block transport_totalvalue_block">
                          <p className="total_truck"> Transporter Total : </p>
                          <p className="total_truck_value "> {TransporterTotal_pen}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </section >
              </div>
              <div id='mypdf-details' className='deliverPdf-details' style={{ display: "none" }} >
                <header className="attachement_header">
                  <div className="container">
                    <div className="header_first_section ">
                      <div className="logo">
                        <a href=""> <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/logo_img.svg" alt="img" /></a>
                      </div>
                      <div className="notification-part">
                        <p className="date"> Date : <span> {moment().format('DD-MMM-YY HH:mm')} </span> </p>
                      </div>
                    </div>
                  </div>
                </header>
                <section className="attachement_section">
                  <div className="container">
                    <div className="transport_trip_details_banner   Transporter_delivery_details">
                      <h2> TRANSPORTER DETAILED SUMMARY  </h2>
                      <div className="transport_trip_details">
                        <div className="heading clearfix">
                          {Transporter_Selected == "-" ?
                            <h4> Transporter- <span>  ALL </span> </h4>
                            :
                            <h4> Transporter - <span>  {Transporter_Selected} </span> </h4>
                          }
                        </div>
                        {handler.state.isClickedDeliverDetailedItem === true &&
                          <div id='deliver-pdf-data'>
                            {DetailedDeliverPDFJsx}
                            {DetailedDeliverUnmatchedPDFJsx}
                          </div>
                        }
                        <div className="total_truck_block transport_totalvalue_block">
                          <p className="total_truck"> Transporter Total : </p>
                          {this.state.TotalDelivered < 600 &&
                            <p className="total_truck_value"> {TransporterTotal_del} </p>
                          }
                          {this.state.TotalDelivered > 600 &&
                            <p className="total_truck_value"> {MasterArray}</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div id='mypdf' className='deliverPdf' style={{ display: "none" }} >
                <header className="attachement_header">
                  <div className="container">
                    <div className="header_first_section ">
                      <div className="logo">
                        <a href=""> <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/logo_img.svg" alt="img" /></a>
                      </div>
                      <div className="notification-part">
                        <p className="date"> Date : <span> {moment().format('DD-MMM-YY HH:mm')} </span> </p>
                      </div>
                    </div>
                  </div>
                </header>
                <section className="attachement_section">
                  <div className="container">
                    <div className="transport_trip_details_banner   Transporter_delivery_details">
                      <h2> TRANSPORTER  SUMMARY  </h2>
                      <div className="transport_trip_details">
                        <div className="heading clearfix">
                          {Transporter_Selected == "-" ?
                            <h4> Transporter- <span>  ALL </span> </h4>
                            :
                            <h4> Transporter - <span>  {Transporter_Selected} </span> </h4>
                          }
                        </div>
                        {handler.state.isClickedDeliverDetailedItem === false &&
                          <div id='deliver-pdf-data'>
                            {DeliverPDFJsx}
                            {DeliverUnmatchedPDFJsx}
                          </div>
                        }
                        <div className="total_truck_block transport_totalvalue_block">
                          <p className="total_truck"> Transporter Total : </p>
                          <p className="total_truck_value"> {TransporterTotal_del} </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
            <section style={{ display: "none" }} id='loader_icon'>
              <div>
                <img src='https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Spin-1s-100px%20(8).gif' alt='Loading...'></img>
              </div>
            </section>
          </div>
        }
        {
          this.state.isBillingDashboard == true &&
          <DnBillingDashboard description={''} siteurl={this.props.siteurl} context={this.props.context}></DnBillingDashboard>
        }
      </>
    );
  }
}

