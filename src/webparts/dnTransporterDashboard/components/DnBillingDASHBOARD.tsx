import * as React from 'react';
import styles from './DnTransporterDashboard.module.scss';
import { IDnTransporterDashboardProps } from './IDnTransporterDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { WebPartContext } from '@microsoft/sp-webpart-base';
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
import { Items } from '@pnp/sp/items';
import * as moment from 'moment';
import 'datatables.net-dt/css/jquery.dataTables.css';
import * as XLSX from 'xlsx';
import { sp } from '@pnp/sp/presets/all';
import Swal from 'sweetalert2'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import { PnPBatch}  from "@pnp/pnpjs";
import { SPBatch } from "@pnp/sp/presets/all";
import * as html2pdf from 'html2pdf.js';
import * as ReactDOMServer from 'react-dom/server';
import DnTransporterDashboard from './DnTransporterDashboard';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { IWeb } from "@pnp/sp/webs/types";

let CurrentLoggedinuserID;
let CurrentLoggedinuserEmail: string;
let Items1: string;
let CurrentLoggedinuserName;
let TotalEntries;
let Delivered;
let Pending;
var SelectedId;
var Selecteddnnumber;
var DocumentName: any;
let tabl = null;
var Attachfiles: any[];
var MasterArray: any = [];
var Transporter_Selected = "-";
// var selectedDate: any;
var responses = [];
var filteredData_pending = [];
var filteredData_deliver = [];
var pdfTruckType: string;
var pdfTruckTypeCount;
var totalCount;
var totalCountFromLocation;
var finalDeliverPDFArray;
var currentDate;
var chargeListPendingItem = [];
var uniqueTruckNumber: any = [];
// var uniqueFromLocations_del = [];
var uniqueTruckNumbers_billed: any[] = [];
var unmatchedUniqueTruckNumbers_billed: any[] = [];
var UniqueTruckNumbers_yettobilled: any[] = [];
var UnmatchedUniqueTruckNumbers_yettobilled: any[] = [];
var transporterList: any[] = [];
var selectedTransporter = '';
var AllData: any[] = [];
const batch = sp.createBatch();
var DownloadingStatus = "";

// var DownloadingInprogress: boolean = false;

// var pendingArray = [];
// var deliverArray = [];
// SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
// SPComponentLoader.loadScript(`https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js`);
// SPComponentLoader.loadScript("https://code.jquery.com/jquery-3.6.0.js");
// SPComponentLoader.loadScript("https://code.jquery.com/ui/1.13.1/jquery-ui.js");
// SPComponentLoader.loadCss('https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/CSS/style.css?v=4.7');
// SPComponentLoader.loadCss('https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/CSS/printstyle.css?v=2.1');



export interface IDnTransporterDashboardState {
    Isdataloaded: boolean;
    Items: any[];
    BilledItems: any[];
    YetToBilledItems: any[];
    IsEmailpresent: boolean;
    Items1: any[];

    CurrentUserName: any[];
    CurrentUserDesignation: any[];
    CurrentLoggedinuserNameState: any;
    CurrentUserEmail: any;
    TotalEntries: any;
    TotalBilled: any;
    TotalPending: any;
    // CurrentSelectedDate: string;
    startDate: any;
    endDate: any;
    startDateSelected: boolean, // Track if start date is chosen
    endDateSelected: boolean,
    Data: IDataItem[];
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
    PDFDeliverUniqueunmatchedItem: any[],
    PDFPendingItem: any[];
    PDFPendingItemZeroCharge: any[],
    PDFUnmatchedItem: any[],
    PDFUnmatchedItemDeliver: any[],
    CurrentDateTime_pending: string;
    CurrentDateTime_deliver: string;
    chargeListPendingItem: any[];
    pendingArrayItem: any[];
    deliverArrayItem: any[];
    billedArrayItem: any[];
    yetToBilledArrayItem: any[];
    isTransporterDashboard: boolean,
    isBillingDashboard: boolean,
    isDeliverdDN: boolean,
    isclickedsumbit: boolean,
    // isYetToDeliverdDN: boolean,
    selectedReport: any;
    reportClass: any;
    selectedTransporter: any;
    isClickedBilledItem: boolean,
    isClickedYetToBilledItem: boolean,

    isClickedBilledConsolidated: boolean,
    PDFBilledItem: any[],
    PDFUnmatchedBilledItem: any[],
    PDFYetToBilledItem: any[],
    PDFUnmatchedYetToBilledItem: any[],
    hiddenTruckTypeIndexes: number[];
    DownloadingInprogress: boolean;
    DownloadingStatus: string;






}
interface IDataItem {
    DeliveryNumber: number;
    TripNumber: string;
    RevisedTripNuber: any;
    Created: string;
    CompanyName: string;
    FromAddress: string;
    ToAddress: string;
    Trucktype: string;
    Trucknumber: string;
    DriverName: string;
    DeliveryStatus: string;
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
// let Newweb = Web("https://balmerlawries.sharepoint.com/sites/DN-Transport/");

let newweb = Web("https://balmerlawries.sharepoint.com/sites/DN-Transport/");
var momentStartDate = '';
var momentEndDate = '';
var adjustedEndDate;
var hideTruckTypeIndex: number[] = [];

// var startDate = '2024-01-01';
// var endDate =  moment().format('YYYY-MM-DD');

export default class DnBillingDashboard extends React.Component<IDnTransporterDashboardProps, IDnTransporterDashboardState, {}> {
    public constructor(props: IDnTransporterDashboardProps, state: IDnTransporterDashboardState) {
        super(props);
        var selectstartdate = $("#txt-start-date").val();//2023-10
        momentStartDate = moment(selectstartdate).format("YYYY-MM-DD");
        var selectenddate = $("#txt-end-date").val();//2023-10
        momentEndDate = moment(selectenddate).format("YYYY-MM-DD");

        this.state = {

            DNFile: "",
            DNFileStatus: "Pending",
            PDFPendingItem: [],
            PDFPendingItemZeroCharge: [],
            PDFUnmatchedItem: [],
            PDFUnmatchedItemDeliver: [],
            PDFDeliveredItem: [],
            // PDFDeliveredItemNonZeroCharge: [],
            PDFDeliverUniqueunmatchedItem: [],
            Isdataloaded: true,
            IsSavinginProgress: false,
            showProgress: false,
            progressLabel: "File upload in progress",
            progressDescription: "",
            progressPercent: 0,
            CurrentDateTime_pending: moment().format('DD-MMM-YY HH:mm'),
            CurrentDateTime_deliver: moment().format('DD-MMM-YY HH:mm'),
            IsDNFileUploadingStatusdone: false,
            pendingArrayItem: [],
            Data: [],
            DataTables_Value: false,
            TotalEntries: 0,
            TotalBilled: 0,
            TotalPending: 0,
            Items: [],
            BilledItems: [],
            YetToBilledItems: [],
            IsEmailpresent: false,
            Items1: [],
            CurrentUserName: [],
            CurrentUserDesignation: [],
            CurrentLoggedinuserNameState: "",
            CurrentUserEmail: "",
            // CurrentSelectedDate: moment().format("YYYY-MM-DD"),
            // startDate: moment().format('YYYY-MM-DD'), // Set the initial start date
            startDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'), // Set the initial end date to the current date
            IsCurrentUserIsAdmin: false,
            chargeListPendingItem: [],
            deliverArrayItem: [],
            billedArrayItem: [],
            yetToBilledArrayItem: [],
            isTransporterDashboard: false,
            isBillingDashboard: true,
            isDeliverdDN: true,
            // isYetToDeliverdDN: false,
            isclickedsumbit: false,
            selectedReport: null,
            reportClass: "",
            selectedTransporter: null,
            isClickedBilledItem: false,
            isClickedBilledConsolidated: false,
            isClickedYetToBilledItem: false,
            PDFBilledItem: [],
            PDFUnmatchedBilledItem: [],
            PDFYetToBilledItem: [],
            PDFUnmatchedYetToBilledItem: [],
            hiddenTruckTypeIndexes: [],
            startDateSelected: false, // Track if start date is chosen
            endDateSelected: false,
            DownloadingInprogress: false,
            DownloadingStatus: "",


        }
    }

    componentDidMount() {
        $("#Load_content").hide();
        $("#loader_icon").show();
        const { Downloadstatus, Isdownloading } = this.props;
        // Check if downloading is in progress
        if (Isdownloading) {
            this.setState({ DownloadingInprogress: true });
            $(".PDF_block").addClass("active");
        }

        // Check if downloading is completed
        if (DownloadingStatus === "B-Completed" || Downloadstatus === "T-Completed") {
            $(".PDF_block").removeClass("active");
            this.setState({ DownloadingInprogress: false });
        }
        $.fn.dataTable.ext.errMode = 'none';
        $(".popup_banner").hide();
        $(".popup_div").hide();
        newweb.currentUser.get()
            .then(user => {
                CurrentLoggedinuserID = user.Id;
                CurrentLoggedinuserName = user.Title;
                CurrentLoggedinuserEmail = user.Email;
                this.setState({ CurrentLoggedinuserNameState: CurrentLoggedinuserName });
            })
            .catch(error => {
                console.error("Error fetching current user:", error);
            })
            .finally( async() => {
                $(".delivereddn").addClass("active");
                await this.Group_Details("default_loading");
                this.hideLoader();
            });
    }


    // public componentDidMount() {
    //     // var Status = this.props.Downloadstatus;
    //     // window.addEventListener('beforeunload', function (e) {
    //     //     // Display a confirmation message
    //     //     if (DownloadingStatus != "B-Completed" || Status != "T-Completed") {
    //     //         const confirmationMessage = 'Download Inprogress, Are you sure you want to leave this page?';
    //     //         console.log(e);
    //     //         console.log(e.returnValue);
    //     //         // Some browsers require you to return the confirmation message
    //     //         e.returnValue = confirmationMessage;
    //     //         // Return the confirmation message (not required by all browsers)
    //     //         return confirmationMessage;
    //     //     }
    //     // });

    //     if (this.props.Isdownloading == true) {
    //         this.setState({ DownloadingInprogress: true });
    //         $(".PDF_block").addClass("active")
    //         // $(".Reports_download").show();
    //         // $(".select_report_btn").hide();
    //     }
    //     if (DownloadingStatus == "B-Completed" || this.props.Downloadstatus == "T-Completed") {
    //         $(".PDF_block").removeClass("active")
    //         this.setState({ DownloadingInprogress: false });
    //     }
    //     // else {
    //     //     $(".PDF_block").removeClass("active")
    //     //     this.setState({ DownloadingStatus: "Completed", DownloadingInprogress: false });
    //     // }
    //     $.fn.dataTable.ext.errMode = 'none';
    //     $(".popup_banner").hide();
    //     $(".popup_div").hide()
    //     newweb.currentUser.get().then((user) => {
    //         CurrentLoggedinuserID = user.Id;
    //         CurrentLoggedinuserName = user.Title;
    //         CurrentLoggedinuserEmail = user.Email;
    //         this.setState({ CurrentLoggedinuserNameState: CurrentLoggedinuserName });
    //     })
    //         .then(() => {
    //             $(".delivereddn").addClass("active");
    //             // this.GetCurrentUserDetails();
    //             this.Group_Details("defaut_loading");
    //         })
    //         catch(){

    //         }
    //          finally {
    //             this.hideLoader();
    //         }
    // }

    public async GetAllTransporterDetails() {
        const headers = new Headers({
            "Accept": "application/json;odata=verbose",
            "Accept-Language": "en-US"
        });
        // Initialize an empty array to hold all the results
        let allItems: any[] = [];
        let items = null;
        // Get the first batch of items
        items = await newweb.lists.getByTitle("Delivery Note Transactions").items
            .select("TransporterName", "ID")
            .top(5000)
            .configure({ headers: headers })
            .getPaged();
        // Concatenate the results of the first batch
        allItems = allItems.concat(items.results);
        // Continue fetching next batches while there are more items
        while (items.hasNext) {
            items = await items.getNext();
            allItems = allItems.concat(items.results);
        }
        // Assign all fetched data to AllData
        if (allItems.length != 0) {
            AllData = allItems;
        }
    }
    public hideLoader() {
        setTimeout(() => {
        $("#loader_icon").hide();
        $("#Load_content").show();
        }, 1000);
    }

    public async getItems(modetype: string, Loading_Type: any) {
        try {
            let filter = '';
            // Apply additional filter based on modetype
            if (modetype === "DNTransporterPresent") {
                filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DeliveryStatus ne 'Cancelled' and DeliveryStatus ne 'Not Applicable'`;
            } else {
                const groups = await newweb.currentUser.groups();
                const isAdmin = groups.some(group => group.Title === "Transporter Dashboard Admin");
                this.setState({
                    IsCurrentUserIsAdmin: isAdmin,
                });
                // alert(this.props.description);
                if (selectedTransporter === '') {
                    // await this.GetAllTransporterDetails();
                    const result = await newweb.lists.getByTitle("DN Transporter Details Master").items
                        .select("Title", "Email")
                        // .filter(`Email eq '${CurrentLoggedinuserEmail}'`)
                        .get();
                    // console.log(result);
                    const titles = result.map(item => item.Title);
                    // Use a Set to get unique titles
                    const uniqueTitles = [...new Set(titles)];
                    // Log the unique titles
                    // console.log(uniqueTitles);
                    transporterList = uniqueTitles;
                    // Items1 = transporterList[0];
                    Items1 = this.props.description;
                    Transporter_Selected = Items1;
                    selectedTransporter = Items1;
                }
                filter = `ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DeliveryStatus ne 'Cancelled' and DeliveryStatus ne 'Not Applicable'`;
            }

            const allItemsPromise = newweb.lists.getByTitle("Delivery Note Transactions").items
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
                    "DeliveryStatus",
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
                    "ID"
                )
                .filter(filter)
                .top(5000)
                .get();
            // Retrieve items with the specified query options
            const [allItems] = await Promise.all([allItemsPromise]);
            if (allItems.length !== 0) {
                const nullRevisedTripItems: any[] = [];
                const revisedTripItems: any = {};
                MasterArray = allItems;
                // Separate items with null and non-null revised trip numbers
                MasterArray.forEach((item: any) => {
                    if (item.RevisedTripNuber === null) {
                        nullRevisedTripItems.push(item);
                    } else {
                        revisedTripItems[item.RevisedTripNuber] = revisedTripItems[item.RevisedTripNuber] || [];
                        revisedTripItems[item.RevisedTripNuber].push(item);
                    }
                });

                // Process null revised trip items
                const nullRevisedTripDeliveredItems = nullRevisedTripItems.filter(item => item.DeliveryStatus === 'Delivered');

                // Process non-null revised trip items
                const finalItems = [];
                for (const tripNumber in revisedTripItems) {
                    const group = revisedTripItems[tripNumber];
                    const allDelivered = group.every((item: { DeliveryStatus: string; }) => item.DeliveryStatus === 'Delivered');
                    if (allDelivered) {
                        finalItems.push(...group);
                    }
                }

                // Add items with null revised trip numbers and delivered status to the final list
                finalItems.push(...nullRevisedTripDeliveredItems);
                this.setState({
                    Items: finalItems,
                    selectedTransporter: Items1,
                }, async () => {
                    await this.getTotalCount("DNTransporterPresent");
                    await this.getPDFDetailsDeliver();
                });
                if (finalItems.length == 0) {
                    this.setState({
                        Items: [],
                        TotalEntries: 0,
                        TotalBilled: 0,
                        TotalPending: 0,
                        PDFDeliveredItem: [],
                        PDFUnmatchedItemDeliver: [],
                    }, () => {
                        this.showErrorMessage('No DN Available');
                    });
                }
            } else {
                this.setState({
                    Items: [],
                    TotalEntries: 0,
                    TotalBilled: 0,
                    TotalPending: 0,
                    PDFDeliveredItem: [],
                    PDFUnmatchedItemDeliver: [],
                    selectedTransporter: Items1,
                });
                this.showErrorMessage('No DN Available');
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }

    public async getTotalCount(modetype: string) {
        var reactHandler = this;
        var billeddata: any[] = [];
        var yettobilleddata: any[] = [];

        const web = Web(reactHandler.props.siteurl);
        let groups = await web.currentUser.groups();
        // if (modetype == "DNTransporterPresent") {
        var response = reactHandler.state.Items;
        if (response.length != 0) {
            var totalEntries = response.length;
            var Billingdata = response.reduce((count, item) => {
                if (item.BillingStatus == "Billed") {
                    billeddata.push(item);
                    return count + 1;
                }
                return count;
            }, 0);

            var YetToBillData = response.reduce((count, item) => {
                if (item.BillingStatus == "Yet To Bill") {
                    yettobilleddata.push(item);
                    return count + 1;
                }
                return count;
            }, 0);


            this.setState({
                TotalEntries: totalEntries,
                TotalBilled: Billingdata,
                TotalPending: YetToBillData,
                BilledItems: billeddata,
                YetToBilledItems: yettobilleddata,
            }, () => {
                this.getBilledPDF();
                this.getYettoBilledPDF();
            });

            if (Billingdata == 0) {
                this.setState({
                    BilledItems: [],
                });
            }
            if (YetToBillData == 0) {
                this.setState({
                    YetToBilledItems: [],
                });
            }
        }
        else {
            this.setState({
                TotalEntries: 0,
                TotalBilled: 0,
                TotalPending: 0,
                BilledItems: [],
                YetToBilledItems: [],
            });
        }

    }

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
        // this.processing();
        this.setState({
            endDate: moment(adjustedEndDate).format('YYYY-MM-DD'),
            endDateSelected: true,
        })

    };

    Submitdates = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const { startDateSelected, endDateSelected, startDate, endDate } = this.state;
        if (startDateSelected) {
            const diffInDays = moment(endDate).diff(moment(startDate), 'days');
            if (diffInDays > 30) {
                this.showErrorMessage("Please select a date range within 30 days.");
                return;
            }
            this.Group_Details("Selection_of_dates");
        } else {
            let errorMessage = "";
            if (!startDateSelected) {
                errorMessage = "Kindly select From Date";
            }
            this.showErrorMessage(errorMessage);
        }
    }

    public showErrorMessage(message: string) {
        debugger;
        Swal.fire({
            iconHtml: '<img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/deleted_img.svg" class="error-img-class">',
            title: message,
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: true,
            // timer: 3000,
            customClass: {
                title: 'upload_error_title',
                popup: 'swal_delete',
                confirmButton: 'My_btn' // Clast
            }
        });
    }


    public async Group_Details(Mode: string) {
        try {
            // Show loading indicator

            // Destroy the DataTable asynchronously
            // await new Promise(resolve => setTimeout(resolve, 0)); // Allow other tasks to continue
            // var table = $("#DNTable").DataTable();
            // table.destroy();
            // Retrieve data based on user role
            if (CurrentLoggedinuserEmail !== null) {
                const isAdmin = await this.checkAdminStatus(CurrentLoggedinuserEmail);
                if (isAdmin) {
                    await Promise.all([
                        this.getItems("DNTransporterNotPresent", Mode)
                        // this.GetAllTransporterDetails(),
                    ]);
                } else {
                    const result = await newweb.lists.getByTitle("DN Transporter Details Master").items
                        .select("Title", "Email")
                        .filter(`Email eq '${CurrentLoggedinuserEmail}'`)
                        .get();
                    if (result && result.length > 0) {
                        Items1 = result[0].Title;
                        Transporter_Selected = result[0].Title;
                        await Promise.all([
                            this.getItems("DNTransporterPresent", Mode),
                        ]);
                    }
                }
            }
            // Hide loading indicator
            // $("#loader_icon").hide();
            // $("#Load_content").show();
        } catch (error) {
            console.error("Error in Group_Details:", error);
        }
    }

    public async checkAdminStatus(userEmail: any) {
        const web = Web(this.props.siteurl);
        let adminEmails: string | any[] = [];
        try {
            // Retrieve the Transporter Dashboard Admin group
            const adminGroup = await web.siteGroups.getByName("Transporter Dashboard Admin");
            const users = await adminGroup.users();
            adminEmails = users.map(user => user.Email);
        } catch (error) {
            // Handle errors, such as if the group or users couldn't be retrieved
            console.error("Error retrieving emails from admin group:", error);
        }
        return adminEmails.includes(userEmail);
    }

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


    private signOut() {
        // $(".SignOut-li").addClass("active");
        $(".SignOut-li").toggle();
    }
    public hideTruckTypeIndex(index: number) {
        this.setState(prevState => ({
            hiddenTruckTypeIndexes: [...prevState.hiddenTruckTypeIndexes, index],
        }));
    }

    public async getPDFDetailsDeliver() {
        const tableList = this.state.Items;
        await newweb.lists.getByTitle("Transporter Charges Master").items
            .select("Title", "FROM_LOC", "TO_LOC", "CHRG")
            // .filter("IsActive eq '1'")
            .getAll()
            .then((response) => {
                // #### filter Deliver Value ####
                const deliverArray = tableList.filter(item => {
                    const deliveryStatus = item.DeliveryStatus;
                    const truckNumber = item.Trucknumber;
                    const toAddress = item.ToAddress;
                    const fromAddress = item.FromAddress;
                    return deliveryStatus === "Delivered" && truckNumber && toAddress && fromAddress;
                });

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
                // console.log("step 2 filterarraryvalues_deliver key", filterarraryvalues_deliver);
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
                        count: seen1.get(key)
                    };
                });
                var maxTripValue: any = {};
                // Iterate through the array and update the maxCounts object
                addTripCountColumn.forEach(item => {
                    const key = `${item.TruckNumber}-${item.FromAddress}-${item.ToAddress}`;
                    if (!maxTripValue[key] || item.count > maxTripValue[key].count) {
                        maxTripValue[key] = item;
                    }
                });
                // Convert the values of maxCounts object back to an array using map
                var maxCountDeliverValue = Object.keys(maxTripValue).map(key => maxTripValue[key]);
                // console.log("Step 4  maxCountDeliverValue", maxCountDeliverValue);

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
                    const existingGroup = result.find((group: {
                        TruckNumber: any; FromAddress: any;
                    }[]) => group[0].TruckNumber === item.TruckNumber && group[0].FromAddress == item.FromAddress);

                    if (existingGroup) {
                        existingGroup.push(item);
                    } else {
                        result.push([item]);
                    }

                    return result;
                }, []);
                UniqueUnmatchedArrayGroupedByTruckType.sort((a: { TruckNumber: any; }[], b: { TruckNumber: any; }[]) => {
                    const truckNumberA = a[0].TruckNumber;
                    const truckNumberB = b[0].TruckNumber;
                    return truckNumberA.localeCompare(truckNumberB);
                });
                this.setState({
                    PDFDeliveredItem: UniqueMatchedArrayGroupedByTruckType,
                    PDFUnmatchedItemDeliver: UniqueUnmatchedArrayGroupedByTruckType
                });
            })
            .catch((error) => {
                console.error("Error fetching PDF details", error);
            });
    }

    public getBilledPDF() {
        const tableList = this.state.BilledItems;
        newweb.lists.getByTitle("Transporter Charges Master").items
            .select("Title", "FROM_LOC", "TO_LOC", "CHRG")
            // .filter("IsActive eq '1'")
            .getAll()
            .then((response) => {

                // #### filter Deliver Value ####
                var deliverArray = [];
                //  $(".deliverd_items").remove();
                for (var i = 0; i < tableList.length; i++) {
                    let billingStatus = tableList[i].BillingStatus;
                    let Trucknumber = tableList[i].Trucknumber;
                    let ToAddress = tableList[i].ToAddress;
                    let FromAddress = tableList[i].FromAddress
                    if (billingStatus == "Billed" && Trucknumber != null && ToAddress != null && FromAddress != null) {
                        deliverArray.push(tableList[i]);
                        this.setState({
                            billedArrayItem: deliverArray
                        });

                    }
                }

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
                // console.log("step 2 filterarraryvalues_deliver key", filterarraryvalues_deliver);

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
                        count: seen1.get(key)
                    };
                });
                var maxTripValue: any = {};
                // Iterate through the array and update the maxCounts object
                addTripCountColumn.forEach(item => {
                    const key = `${item.TruckNumber}-${item.FromAddress}-${item.ToAddress}`;
                    if (!maxTripValue[key] || item.count > maxTripValue[key].count) {
                        maxTripValue[key] = item;
                    }
                });
                // Convert the values of maxCounts object back to an array using map
                var maxCountDeliverValue = Object.keys(maxTripValue).map(key => maxTripValue[key]);
                // console.log("Step 4  maxCountDeliverValue", maxCountDeliverValue);

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

                // console.log("unmatchedObjects_1", unmatchedObjects);

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

                // console.log("UniqueMatchedArrayGroupedByTruckType", UniqueMatchedArrayGroupedByTruckType);

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
                this.setState({
                    PDFBilledItem: UniqueMatchedArrayGroupedByTruckType,
                    PDFUnmatchedBilledItem: UniqueUnmatchedArrayGroupedByTruckType,
                });
            })
            .catch((error) => {
                console.error("Error fetching PDF details", error);
            });
    }

    public getYettoBilledPDF() {
        const tableList = this.state.YetToBilledItems;
        // PDFYetToBilledItem = [];
        // PDFUnmatchedYetToBilledItem = [];

        newweb.lists.getByTitle("Transporter Charges Master").items
            .select("Title", "FROM_LOC", "TO_LOC", "CHRG")
            // .filter("IsActive eq '1'")
            .getAll()
            .then((response) => {

                // #### filter Deliver Value ####
                var deliverArray = [];
                //  $(".deliverd_items").remove();
                for (var i = 0; i < tableList.length; i++) {
                    let billingStatus = tableList[i].BillingStatus;
                    let Trucknumber = tableList[i].Trucknumber;
                    let ToAddress = tableList[i].ToAddress;
                    let FromAddress = tableList[i].FromAddress
                    if (billingStatus == "Yet To Bill" && Trucknumber != null && ToAddress != null && FromAddress != null) {
                        deliverArray.push(tableList[i]);
                        this.setState({
                            yetToBilledArrayItem: deliverArray
                        });

                    }
                }
                // console.log("YettobilledArray", this.state.yetToBilledArrayItem);
                // console.log("step1  filter deliverArray ", deliverArray);

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
                // console.log("step 2 filterarraryvalues_deliver key", filterarraryvalues_deliver);

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
                        count: seen1.get(key)
                    };
                });
                var maxTripValue: any = {};
                // Iterate through the array and update the maxCounts object
                addTripCountColumn.forEach(item => {
                    const key = `${item.TruckNumber}-${item.FromAddress}-${item.ToAddress}`;
                    if (!maxTripValue[key] || item.count > maxTripValue[key].count) {
                        maxTripValue[key] = item;
                    }
                });
                // Convert the values of maxCounts object back to an array using map
                var maxCountDeliverValue = Object.keys(maxTripValue).map(key => maxTripValue[key]);
                // console.log("Step 4  maxCountDeliverValue", maxCountDeliverValue);

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

                // console.log("unmatchedObjects_1", unmatchedObjects);

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

                // console.log("UniqueMatchedArrayGroupedByTruckType", UniqueMatchedArrayGroupedByTruckType);

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
                this.setState({
                    PDFYetToBilledItem: UniqueMatchedArrayGroupedByTruckType,
                    PDFUnmatchedYetToBilledItem: UniqueUnmatchedArrayGroupedByTruckType,
                    // isClickedYetToBilledItem: true,

                    // isClickedBilledItem: false,
                    // }, () => {
                    //     this.deliveredyettobilledPDF();
                });
                // console.log("state.PDFYetToBilledItem", this.state.PDFYetToBilledItem);
                // console.log("state.PDFUnmatchedYetToBilledItem", this.state.PDFUnmatchedYetToBilledItem);

            })
            .catch((error) => {
                console.error("Error fetching PDF details", error);
            });
    }

    public deliveredBilledPDF = async (e: { preventDefault: () => void; }) => {
        // await this.getBilledPDF();
        e.preventDefault();

        this.setState({
            CurrentDateTime_deliver: moment().format('DD-MMM-YY HH:mm'),
            isClickedBilledItem: true,
            isClickedYetToBilledItem: false,
        });
        var mathcedItems = this.state.PDFBilledItem.length;
        var unmathcedItems = this.state.PDFUnmatchedBilledItem.length;
        if (mathcedItems != 0 || unmathcedItems != 0) {
            $(".PDF_block").addClass("active");
            $("#pdf-margin").show();
            $(".deliverPdf-details").show();
            $(".pdf_banner").hide();
            // e.preventDefault();
            // this.pleasewaitalert();
            try {
                await this.waitForRenderCompletion(async () => {
                    var pdfjs = document.querySelector("#bill") as HTMLElement;
                    if (!pdfjs) {
                        throw new Error("Element with ID 'bill' not found");
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
                    // Create a link element
                    const link = document.createElement('a');
                    // Set the href attribute to a URL created from the Blob
                    link.href = URL.createObjectURL(file);
                    // Set the download attribute to the desired filename
                    // link.download = 'requestor.pdf';
                    // link.download = `Summary-Report- ${moment(this.state.SelectedStartDate, "MM/DD/YYYY").format("DD-MM-YYYY")}.pdf`
                    link.download = `Summary-Billed-${moment().format('DD-MM-YYYY')}.pdf`;
                    this.Successalert('PDF Downloaded successfully!');
                    this.setState({ DownloadingInprogress: false })
                    // DownloadingInprogress = false;
                    // Append the link to the document
                    document.body.appendChild(link);
                    // Trigger a click on the link to start the download
                    link.click();
                }, 5000);
            } catch (error) {
                console.error("Error generating or downloading PDF:", error);
            }
            $("#pdf-margin").hide();
            $(".deliverPdf-details").hide();
            $(".pdf_banner").show();
        } else {
            $(".PDF_block").removeClass("active");
            this.showErrorMessage('No Billed DN Available for Download');
            this.setState({ DownloadingInprogress: false })
        }
    };

    public deliveredyettobilledPDF = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // await this.getYettoBilledPDF();
        this.setState({
            CurrentDateTime_deliver: moment().format('DD-MMM-YY HH:mm'),
            isClickedYetToBilledItem: true,
            isClickedBilledItem: false,
        });
        var mathcedItems = this.state.PDFYetToBilledItem.length;
        var unmathcedItems = this.state.PDFUnmatchedYetToBilledItem.length;
        if (mathcedItems != 0 || unmathcedItems != 0) {
            $(".PDF_block").addClass("active");
            this.pleasewaitalert();
            $("#pdf-margin").show();
            $(".yettobillPdf-details").show();
            $(".pdf_banner").hide();
            try {
                await this.waitForRenderCompletion(async () => {
                    var pdfjs = document.querySelector("#yettobill") as HTMLElement;
                    if (!pdfjs) {
                        throw new Error("Element with ID 'yettobill' not found");
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
                    // Create a link element
                    const link = document.createElement('a');
                    // Set the href attribute to a URL created from the Blob
                    link.href = URL.createObjectURL(file);
                    link.download = `Summary-YetToBilled-${moment().format('DD-MM-YYYY')}.pdf`;
                    this.Successalert('PDF Downloaded successfully!');
                    this.setState({ DownloadingInprogress: false })
                    // DownloadingInprogress = false;
                    // Append the link to the document
                    document.body.appendChild(link);
                    // Trigger a click on the link to start the download
                    link.click();
                }, 5000);
            } catch (error) {
                console.error("Error generating or downloading PDF:", error);
            }
            $("#pdf-margin").hide();
            $(".yettobillPdf-details").hide();
            $(".pdf_banner").show();
        } else {
            $(".PDF_block").removeClass("active");
            this.showErrorMessage('No Yet To Bill DN Available for Download')
            this.setState({ DownloadingInprogress: false })
        }
    };

    public waitForRenderCompletion = async (callback: { (): Promise<void>; (): Promise<void>; (): void; }, timeout: number) => {
        await this.forceUpdate(callback); // Trigger re-rendering to ensure rendering completion
        await new Promise(resolve => setTimeout(resolve, timeout)); // Wait for the specified timeout duration
    };

    public ConfirmBilling(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        // Initialize a batch
        var batch = sp.createBatch();
        // Retrieve items from the list based on the ProjectTitle
        newweb.lists.getByTitle("Delivery Note Transactions")
            .items.select("*")
            .filter(`ActualCreatedDatewithTime ge '${this.state.startDate}' and ActualCreatedDatewithTime le '${this.state.endDate}T23:59:59' and TransporterName eq '${Items1}' and DeliveryStatus eq 'Delivered' and BillingStatus eq 'Yet To Bill'`)
            .inBatch(batch)
            .getAll()
            .then((items: any[]) => {
                // Check if there are any items to be billed
                if (items.length > 0) {
                    // Update each item's Status to "Billed"
                    items.forEach(item => {
                        newweb.lists.getByTitle("Delivery Note Transactions")
                            .items.getById(item.Id)
                            .inBatch(batch)
                            .update({
                                BillingStatus: 'Billed',
                            }).then((e: any) => {
                                this.Group_Details(e);
                                this.Successalert('Billed Successfully');
                                Swal.fire({
                                    iconHtml: '<img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/successfully_img%201.svg" alt="Your Image" class="my-img-class">',
                                    title: 'Billed Successfully',
                                    // text: 'PDF Downloaded successfully!',
                                    icon: 'success',
                                    timer: 3000,
                                    allowOutsideClick: false,
                                    showConfirmButton: true,
                                    customClass: {
                                        popup: 'swal_success', // Class for the overall modal
                                        title: 'upload_success_title', // Class for title
                                        //   content: 'upload_success_content', // Class for text
                                        confirmButton: 'My_btn' // Class for the confirm button
                                    }
                                });
                                // Swal.fire({
                                //     icon: 'success',
                                //     title: 'Billed Successfully',
                                //     allowOutsideClick: false,
                                //     showConfirmButton: false,
                                //     timer: 3000
                                // });
                            });
                    });

                    // Execute the batch
                    return batch.execute();
                } else {
                    this.showErrorMessage('No Reports Available To Bill');
                }
            })
            .then(() => {
                console.log("Batch operations completed successfully for Tax Management Items Transaction");
            })
            .catch((error) => {
                // Handle other errors if needed
                console.log("Error in batch operations for Tax Management Items Transaction: " + error);
            });
    }

    handleReportSelection = (event: any) => {
        const selectedReport = event.target.value;
        const selectedOptionText = event.target.options[event.target.selectedIndex].text.trim(); // Get the text content of the selected option and trim any leading or trailing whitespace
        const optionTextLength = selectedOptionText.length;
        let reportClass = '';
        this.setState({ DownloadingStatus: "Inprogress-B" });
        // DownloadingStatus = "Inprogress-B"
        // Set class based on the selected option
        switch (selectedReport) {
            case 'billed':
                reportClass = 'SBR';
                break;
            case 'yettobilled':
                reportClass = 'SYBR';
                break;
            case 'billedconsolidated':
                reportClass = 'CR_B';
                break;
            case 'yettobilledconsolidated':
                reportClass = 'CR_YB';
                break;
            default:
                reportClass = '';
                break;
        }

        // if (selectedReport == "") {
        //     $("#reportDropdown").css("width", "130px"); // Set width to 100px if option text length is less than 10 characters
        //     $("#reportDropdown").get(0).style.setProperty("background-position-x", "110px", "important");
        // } else {
        //     if (optionTextLength <= 26) { // Example condition, adjust as needed
        //         $("#reportDropdown").css("width", "200px"); // Set width to 100px if option text length is less than 10 characters
        //         $("#reportDropdown").get(0).style.setProperty("background-position-x", "180px", "important");
        //     } else {
        //         $("#reportDropdown").css("width", "230px"); // Set width to 500px otherwise
        //         $("#reportDropdown").get(0).style.setProperty("background-position-x", "210px", "important");
        //     }
        // }

        this.setState({ selectedReport, reportClass }, () => {
            this.SelectReport(event);
        })
    };

    SelectReport = (e: any) => {
        // DownloadingInprogress = true;
        this.setState({ DownloadingInprogress: true })
        // $(".Reports_download").show();
        // $(".select_report_btn").hide();
        // $(".PDF_block").addClass("active");
        // You can call the specific function based on the selected report
        if (this.state.selectedReport === 'billed') {
            // this.getBilledPDF();
            this.deliveredBilledPDF(e)
        } else if (this.state.selectedReport === 'yettobilled') {
            // this.getYettoBilledPDF();
            // setTimeout(() => {
            this.deliveredyettobilledPDF(e);
            // }, 2000);
        } else if (this.state.selectedReport === 'billedconsolidated') {
            this.setState({
                isClickedBilledConsolidated: true
            }, () => {
                // console.log("billed");
                this.downloadConsolidatedPDF();
            })
        } else if (this.state.selectedReport === 'yettobilledconsolidated') {
            this.setState({
                isClickedBilledConsolidated: false
            }, () => {
                // console.log("yettobilled");
                this.downloadConsolidatedPDF();
            })
        }
    };

    public async fetchPDFFiles(): Promise<{ data: Uint8Array; fileName: string; CreationDate: string; }[]> {
        try {
            const stampedItems: any[] = this.state.isClickedBilledConsolidated ? this.state.BilledItems : this.state.YetToBilledItems; // Assuming this.state.StampedItem contains the stamped items with delivery numbers
            const reportFiles: { data: Uint8Array; fileName: string; CreationDate: string }[] = [];
            const DNNum = stampedItems.map(item => item.DeliveryNumber); // Extract delivery numbers

            for (let i = 0; i < DNNum.length; i++) {
                const deliverynumber = DNNum[i];
                const files = await newweb.lists.getByTitle("DN Customer Emirates ID")
                    .items.select("FileRef", "FileLeafRef", "Modified", "Created")
                    .filter(`substringof('${deliverynumber}', FileLeafRef)`)
                    .getAll();

                // Process the files for this delivery number
                for (const file of files) {
                    const FileName = file.FileLeafRef.split(".")[0];
                    const response = await fetch(file.FileRef, {
                        headers: {
                            'Accept': 'application/json;odata=verbose',
                        },
                    });
                    const arrayBuffer = await response.arrayBuffer();
                    if (arrayBuffer.byteLength !== 0) {
                        const data = new Uint8Array(arrayBuffer);
                        const fileName = file.FileLeafRef; // Assuming FileLeafRef contains the file name
                        const CreationDate: string = moment(file.Created, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm");
                        reportFiles.push({ data, fileName, CreationDate });
                    }
                }
            }
            return reportFiles;
        }

        catch (error) {
            // console.error("Error fetching reports:", error);
            return [];
        }
    }

    public isValidPdfBytes(pdfBytes: Uint8Array): boolean {
        // Check for minimum file size
        if (pdfBytes.length < 10) {
            return false; // File is too small to be a valid PDF
        }
        // Check for PDF header
        const header = "%PDF-";
        const headerBytes = new Uint8Array(header.length);
        for (let i = 0; i < header.length; i++) {
            headerBytes[i] = header.charCodeAt(i);
        }
        for (let i = 0; i < headerBytes.length; i++) {
            if (pdfBytes[i] !== headerBytes[i]) {
                return false; // PDF header mismatch
            }
        }

        // Check for PDF trailer (%%EOF)
        const trailer = "%%EOF";
        const trailerBytes = new Uint8Array(trailer.length);
        for (let i = 0; i < trailer.length; i++) {
            trailerBytes[i] = trailer.charCodeAt(i);
        }
        const trailerStartIndex = pdfBytes.length - trailerBytes.length;
        for (let i = 0; i < trailerBytes.length; i++) {
            if (pdfBytes[trailerStartIndex + i] !== trailerBytes[i]) {
                return false; // PDF trailer mismatch
            }
        }

        return true; // PDF bytes pass all checks
    }

    public async mergePDFFiles(pdfFiles: { data: Uint8Array; fileName: string; CreationDate: string }[]): Promise<Uint8Array> {
        const mergedPdf = await PDFDocument.create();
        let pdfDoc: PDFDocument;

        for (const pdfFile of pdfFiles) {
            const pdfBytes = pdfFile.data;
            const fileName = pdfFile.fileName;
            const CreationDate = pdfFile.CreationDate;
            var stringFileName: string = fileName;
            var FileNameArray = stringFileName.split(".");

            // if (this.isValidPdfBytes(pdfBytes) == false) {
            pdfDoc = await PDFDocument.load(pdfBytes);
            // }
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
        }

        return await mergedPdf.save();
    }


    public pleasewaitalert() {
        Swal.fire({
            title: 'Downloading',
            html: 'The PDF file is being downloaded. Please wait...',
            allowOutsideClick: false,
            showConfirmButton: false, // Disable the OK button
            customClass: {
                popup: 'swal_success', // Class for the overall modal
                title: 'downloading_title', // Class for title
                content: 'my-html-container', // Class for HTML content
            },
            imageUrl: 'https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Spin-1s-100px%20(8).gif',
            // onBeforeOpen: () => {
            //   Swal.showLoading();
            // }
        });
        setTimeout(() => {
            Swal.close(); // Close the SweetAlert popup after 2-3 seconds for downloading
        }, 2000);  // Set to 2000 for 2 seconds, 3000 for 3 seconds

    }
    public Successalert(message: string) {
        Swal.fire({
            iconHtml: '<img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/successfully_img.svg" class="my-img-class">',
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
        }).then(() => {
            if (message == "PDF Downloaded successfully!") {
                // $(".Reports_download").hide();
                // $(".select_report_btn").show();
                DownloadingStatus = "B-Completed"
                $(".PDF_block").removeClass("active");
                this.setState({ DownloadingInprogress: false });
            }
        })
    }

    public async downloadConsolidatedPDF() {
        const stampedItems: any[] = this.state.isClickedBilledConsolidated ? this.state.BilledItems : this.state.YetToBilledItems; // Assuming this.state.StampedItem contains the stamped items with delivery numbers
        if (stampedItems.length != 0) {
            $(".PDF_block").addClass("active");
            this.pleasewaitalert();
            const pdfFiles = await this.fetchPDFFiles();
            if (pdfFiles.length != 0) {
                try {
                    // Show downloading loader
                    const mergedPdfBytes = await this.mergePDFFiles(pdfFiles);
                    // Download the merged PDF file
                    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = this.state.isClickedBilledConsolidated ? `ConsolidatedBilledPDF-Report-${moment().format('DD-MM-YYYY')}.pdf` : `ConsolidatedYetToBillPDF-Report-${moment().format('DD-MM-YYYY')}.pdf`;
                    this.Successalert('PDF Downloaded successfully!');
                    this.setState({ DownloadingInprogress: false })
                    // DownloadingInprogress = false;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                    this.showErrorMessage('No valid PDF Found.');
                    this.setState({ DownloadingInprogress: false })
                }
            } else {
                $(".PDF_block").removeClass("active");
                this.showErrorMessage('No DN Available for Download');
                this.setState({ DownloadingInprogress: false })
            }
        } else {
            $(".PDF_block").removeClass("active");
            this.showErrorMessage('No DN Available for Download');
            this.setState({ DownloadingInprogress: false })
        }
    }

    public gotoTransporterDashboard() {
        // uniqueFromLocations_del = [];
        $(".Billing").removeClass("active");
        $(".Transporter").addClass("active");
        this.setState({
            isTransporterDashboard: true,
            isBillingDashboard: false
        })
    }


    public setSelectedTransporter = (value: string) => {
        if (value != null) {
            if (value !== this.state.selectedTransporter) {
                const newStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
                const newEndDate = moment().format('YYYY-MM-DD');
                const newState: any = {
                    selectedTransporter: value,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    deliverArrayItem: [],
                    pendingArrayItem: [],
                    PDFDeliveredItem: [],
                    PDFPendingItem: [],
                    PDFDeliverUniqueunmatchedItem: [],
                    PDFUnmatchedItemDeliver: [],
                    PDFUnmatchedBilledItem: [],
                    PDFBilledItem: [],
                    PDFYetToBilledItem: [],
                    PDFUnmatchedYetToBilledItem: [],
                    billedArrayItem: [],
                    yetToBilledArrayItem: [],
                    isClickedYetToBilledItem: false,
                    isClickedBilledItem: false,
                };
                selectedTransporter = value;
                Items1 = selectedTransporter;
                Transporter_Selected = Items1;
                this.setState(newState, () => {
                    this.Group_Details("Selection_of_transporter");
                });
            }
        } else {
            if (this.state.selectedTransporter !== '') {
                const newState: any = {
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
                });
            }
        }
    }

    public render(): React.ReactElement<IDnTransporterDashboardProps> {
        var handler = this;
        var TransporterTotal_del = 0;
        var uniqueTruckNumbers = [];
        var unmatchedUniqueTruckNumbers = [];
        uniqueTruckNumbers_billed = [];
        unmatchedUniqueTruckNumbers_billed = [];
        UniqueTruckNumbers_yettobilled = [];
        UnmatchedUniqueTruckNumbers_yettobilled = [];
        hideTruckTypeIndex = [];
        var detailedUniqueTruckNumbers_del: any[] = [];
        var detailedUnmatchedUniqueTruckNumbers_del: any[] = [];
        var TruckTypetotalValue_pending = 0;
        var totalCHRG1_bill = 0; // Variable to store the total CHRG for the current TruckNumber
        var totalCHRG2_bill = 0;
        var totalCHRG1_billUnmatch = 0; // Variable to store the total CHRG for the current TruckNumber
        var totalCHRG2_billUnmatch = 0;
        var totalCHRG1_del = 0; // Variable to store the total CHRG for the current TruckNumber
        var totalCHRG2_del = 0;
        var totalCHRG1_deliverUnmatch = 0; // Variable to store the total CHRG for the current TruckNumber
        var totalCHRG2_deliverUnmatch = 0;
        const { selectedReport } = this.state;
        const { selectedTransporter } = this.state;
        var TransporterTotal_billed = 0;
        var totalCHRG1_YetTobill = 0;
        var totalCHRG2_YetTobill = 0;

        var totalCHRG1_YetTobillUnmatch = 0;
        var totalCHRG2_YetTobillUnmatch = 0;
        // var uniqueFromLocations_billed = [];
        // var uniqueFromLocations_yettobilled = [];
        // var uniqueFromLocations = [];     

        // ## new code ##
        const DetailedDeliverPDFJsx: JSX.Element[] = handler.state.PDFDeliveredItem.map((item, key) => {
            var locationWiseValue_del = 0;
            var TruckTypetotalValue_del = 0;
            var values_del = 0;
            var tripCount;
            var uniqueFromLocations_del: any[] = [];
            var prevFromLocation: null = null;
            var truckLengthDel;

            item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
            if (handler.state.isDeliverdDN == true) {
                if (detailedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) === -1) {
                    truckLengthDel = detailedUniqueTruckNumbers_del.length;
                    detailedUniqueTruckNumbers_del.push(item[0].TruckNumber);
                    return (
                        <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                            <div className="col-md-2">
                                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                            if (charge != 0) {
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
                                                                            <th className='BD_date_th'> Date</th>
                                                                            <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                            <th className="text-center  status_th">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {handler.state.deliverArrayItem.map((deliverArray_Item1, index) => {
                                                                            let deliverDate = moment(deliverArray_Item1.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                            var completiondate = moment(deliverArray_Item1.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");

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
                                                                                        <td className='Stampted_dn_td text-center'>
                                                                                            {deliverArray_Item1.DNEIDURL == null ?
                                                                                                "-"
                                                                                                :
                                                                                                <a target="_blank" data-interception="off" href={`${deliverArray_Item1.DNEIDURL.Url}`}>Click Here</a>
                                                                                            }
                                                                                        </td>
                                                                                        {deliverArray_Item1.DeliveryStatus == "Delivered" && deliverArray_Item1.BillingStatus == "Yet To Bill" &&
                                                                                            <td className="text-center status Yet_to_Bill">
                                                                                                <div>
                                                                                                    <span>Yet To Bill</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
                                                                                        {deliverArray_Item1.DeliveryStatus == "Delivered" && deliverArray_Item1.BillingStatus == "Billed" &&
                                                                                            <td className="text-center status Billed">
                                                                                                <div >
                                                                                                    <span>Billed</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
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
                                                                            <th className='BD_date_th'> Date</th>
                                                                            <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                            <th className="text-center  status_th">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {handler.state.deliverArrayItem.map((deliverItems1, index) => {
                                                                            let deliverDate = moment(deliverItems1.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                            var completiondate = moment(deliverItems1.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");
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
                                                                                        <td className='Stampted_dn_td text-center'>
                                                                                            {deliverItems1.DNEIDURL == null ?
                                                                                                "-"
                                                                                                :
                                                                                                <a target="_blank" data-interception="off" href={`${deliverItems1.DNEIDURL.Url}`}>Click Here</a>
                                                                                            }
                                                                                        </td>
                                                                                        {deliverItems1.DeliveryStatus == "Delivered" && deliverItems1.BillingStatus == "Yet To Bill" &&

                                                                                            <td className="text-center status Yet_to_Bill">
                                                                                                <div>
                                                                                                    <span>Yet To Bill</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
                                                                                        {deliverItems1.DeliveryStatus == "Delivered" && deliverItems1.BillingStatus == "Billed" &&
                                                                                            <td className="text-center status Billed">
                                                                                                <div>
                                                                                                    <span>Billed</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }

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
                                {/* {uniqueFromLocations_del.length > 1 && ( */}
                                <div className={`total_truck_block del-${key}`} id={`total-trucktype-del-${key}`}>
                                    <p className="total_truck"> Total of Truck Type : </p>
                                    <p className="total_truck_value">{totalCHRG1_del}</p>
                                </div>
                                {/* )} */}
                            </div>
                        </div>
                    );
                } else {
                    // truckLengthDel = detailedUniqueTruckNumbers_del.length
                    let TruckTypeLengthDel = key - 1;
                    if (detailedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) !== -1) {
                        setTimeout(() => {
                            $("#total-trucktype-del-" + TruckTypeLengthDel + "").hide();
                            // $(".del-" + TruckTypeLengthDel + "").hide();
                            // $("#total-trucktype-del-" + TruckTypeLengthDel + "").css({ display: "none" });
                        }, 2000);
                    }
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
                                                                            <th className='BD_date_th'> Date</th>
                                                                            <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                            <th className="text-center  status_th">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {handler.state.deliverArrayItem.map((deliver_Items1, index) => {
                                                                            let deliverDate = moment(deliver_Items1.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                            var completiondate = moment(deliver_Items1.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");
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
                                                                                        <td className='Stampted_dn_td text-center'>
                                                                                            {deliver_Items1.DNEIDURL == null ?
                                                                                                "-"
                                                                                                :
                                                                                                <a target="_blank" data-interception="off" href={`${deliver_Items1.DNEIDURL.Url}`}>Click Here</a>
                                                                                            }
                                                                                        </td>
                                                                                        {deliver_Items1.DeliveryStatus == "Delivered" && deliver_Items1.BillingStatus == "Yet To Bill" &&
                                                                                            <td className="text-center status Yet_to_Bill">
                                                                                                <div>
                                                                                                    <span>Yet To Bill</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
                                                                                        {deliver_Items1.DeliveryStatus == "Delivered" && deliver_Items1.BillingStatus == "Billed" &&
                                                                                            <td className="text-center status Billed">
                                                                                                <div>
                                                                                                    <span>Billed</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }

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
                                                                            <th className='BD_date_th'> Date</th>
                                                                            <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                            <th className="text-center  status_th">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {handler.state.deliverArrayItem.map((deliver_Items, index) => {
                                                                            let deliverDate = moment(deliver_Items.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                            var completiondate = moment(deliver_Items.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");
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
                                                                                        <td className='Stampted_dn_td text-center'>
                                                                                            {deliver_Items.DNEIDURL == null ?
                                                                                                "-"
                                                                                                :
                                                                                                <a target="_blank" data-interception="off" href={`${deliver_Items.DNEIDURL.Url}`}>Click Here</a>
                                                                                            }
                                                                                        </td>
                                                                                        {deliver_Items.DeliveryStatus == "Delivered" && deliver_Items.BillingStatus == "Yet To Bill" &&
                                                                                            <td className="text-center status Yet_to_Bill">
                                                                                                <div>
                                                                                                    <span>Yet To Bill</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
                                                                                        {deliver_Items.DeliveryStatus == "Delivered" && deliver_Items.BillingStatus == "Billed" &&
                                                                                            <td className="text-center status Billed">
                                                                                                <div>
                                                                                                    <span> Billed</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
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
                                {/* {uniqueFromLocations_del.length > 1 && ( */}
                                <div className="total_truck_block" >
                                    <p className="total_truck"> Total of Truck Type : </p>
                                    <p className="total_truck_value">{totalCHRG1_del + totalCHRG2_del}</p>
                                </div>
                                {/* )} */}
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


            item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
            if (handler.state.isDeliverdDN == true) {
                if (detailedUnmatchedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) === -1) {
                    detailedUnmatchedUniqueTruckNumbers_del.push(item[0].TruckNumber);
                    return (
                        <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                            <div className="col-md-2">
                                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                                                                <th className='BD_date_th'> Date</th>
                                                                                <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                                <th className="text-center  status_th">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {handler.state.deliverArrayItem.map((deliverItems2, index) => {
                                                                                // console.log("inner pending item", pendingItem);
                                                                                let deliverDate = moment(deliverItems2.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                                var completiondate = moment(deliverItems2.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");
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
                                                                                            <td className='Stampted_dn_td text-center'>
                                                                                                {deliverItems2.DNEIDURL == null ?
                                                                                                    "-"
                                                                                                    :
                                                                                                    <a target="_blank" data-interception="off" href={`${deliverItems2.DNEIDURL.Url}`}>Click Here</a>
                                                                                                }
                                                                                            </td>
                                                                                            {deliverItems2.DeliveryStatus == "Delivered" && deliverItems2.BillingStatus == "Yet To Bill" &&
                                                                                                <td className="text-center status Yet_to_Bill">
                                                                                                    <div>
                                                                                                        <span>Yet To Bill</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }
                                                                                            {deliverItems2.DeliveryStatus == "Delivered" && deliverItems2.BillingStatus == "Billed" &&
                                                                                                <td className="text-center status Billed">
                                                                                                    <div>
                                                                                                        <span>Billed</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }
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
                                                                                <th className='BD_date_th'> Date</th>
                                                                                <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                                <th className="text-center  status_th">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {handler.state.deliverArrayItem.map((deliverArrayItems3, index) => {
                                                                                // console.log("inner pending item", deliverArrayItems);
                                                                                let deliverDate = moment(deliverArrayItems3.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                                var completiondate = moment(deliverArrayItems3.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");
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
                                                                                            <td className='Stampted_dn_td text-center'>
                                                                                                {deliverArrayItems3.DNEIDURL == null ?
                                                                                                    "-"
                                                                                                    :
                                                                                                    <a target="_blank" data-interception="off" href={`${deliverArrayItems3.DNEIDURL.Url}`}>Click Here</a>
                                                                                                }
                                                                                            </td>
                                                                                            {deliverArrayItems3.DeliveryStatus == "Delivered" && deliverArrayItems3.BillingStatus == "Yet To Bill" &&
                                                                                                <td className="text-center status Yet_to_Bill">
                                                                                                    <div>
                                                                                                        <span>Yet To Bill</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }
                                                                                            {deliverArrayItems3.DeliveryStatus == "Delivered" && deliverArrayItems3.BillingStatus == "Billed" &&
                                                                                                <td className="text-center status Billed">
                                                                                                    <div>
                                                                                                        <span>Billed</span>
                                                                                                    </div>
                                                                                                </td>

                                                                                            }
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
                    if (detailedUnmatchedUniqueTruckNumbers_del.indexOf(item[0].TruckNumber) !== -1) {
                        setTimeout(() => {
                            $("#total-trucktype-deliver" + TruckTypeLengthDel + "").hide();
                            // $(".del-" + TruckTypeLengthDel + "").hide();
                            // $("#total-trucktype-del-" + TruckTypeLengthDel + "").css({ display: "none" });
                        }, 2000);
                    }

                    return (
                        <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                            <div className="col-md-2">
                                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                                                                <th className='BD_date_th'> Date</th>
                                                                                <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                                <th className="text-center  status_th">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {handler.state.deliverArrayItem.map((deliveredItem, index) => {
                                                                                // console.log("inner pending item", pendingItem);
                                                                                let deliverDate = moment(deliveredItem.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                                var completiondate = moment(deliveredItem.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");

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
                                                                                            <td className='Stampted_dn_td text-center'>{deliveredItem.DNEIDURL == null ?
                                                                                                "-"
                                                                                                :
                                                                                                <a target="_blank" data-interception="off" href={`${deliveredItem.DNEIDURL.Url}`}>Click Here</a>
                                                                                            }
                                                                                            </td>
                                                                                            {deliveredItem.DeliveryStatus == "Delivered" && deliveredItem.BillingStatus == "Yet To Bill" &&
                                                                                                <td className="text-center status Yet_to_Bill">
                                                                                                    <div>
                                                                                                        <span> Yet To Bill</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }

                                                                                            {deliveredItem.DeliveryStatus == "Delivered" && deliveredItem.BillingStatus == "Billed" &&
                                                                                                <td className="text-center status Billed">
                                                                                                    <div>
                                                                                                        <span> Billed</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }
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
                                                                                <th className='BD_date_th'> Date</th>
                                                                                <th className='BD_stampedDN_th'>Stamped DN</th>
                                                                                <th className="text-center  status_th">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {handler.state.deliverArrayItem.map((deliverArray_Items, index) => {

                                                                                let deliverDate = moment(deliverArray_Items.ActualCreatedDatewithTime, "YYYY-MM-DDTH:mm:sZ").format("MM/DD/YYYY HH:mm A");
                                                                                var completiondate = moment(deliverArray_Items.ActualModifiedDateTime, "YYYY-MM-DDTH:mm:sZ").format("YYYY-MM-DD");
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
                                                                                            <td className='Stampted_dn_td text-center'>{deliverArray_Items.DNEIDURL == null ?
                                                                                                "-"
                                                                                                :
                                                                                                <a target="_blank" data-interception="off" href={`${deliverArray_Items.DNEIDURL.Url}`}>Click Here</a>
                                                                                            }
                                                                                            </td>
                                                                                            {deliverArray_Items.DeliveryStatus == "Delivered" && deliverArray_Items.BillingStatus == "Yet To Bill" &&
                                                                                                <td className="text-center status Yet_to_Bill">
                                                                                                    <div>
                                                                                                        <span> Yet To Bill</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }

                                                                                            {deliverArray_Items.DeliveryStatus == "Delivered" && deliverArray_Items.BillingStatus == "Billed" &&
                                                                                                <td className="text-center status Billed">
                                                                                                    <div>
                                                                                                        <span> Billed</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            }
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

        const BilledSummeryMatchedPDFJsx: JSX.Element[] = handler.state.PDFBilledItem.map((item, key) => {
            var locationWiseValue_del = 0;
            var TruckTypetotalValue_del = 0;
            var values_del = 0;
            var tripCount;
            var uniqueFromLocations_billed: any[] = [];
            var prevFromLocation: null = null;

            if (handler.state.isClickedBilledItem == true) {
                item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
                if (uniqueTruckNumbers_billed.indexOf(item[0].TruckNumber) === -1) {
                    uniqueTruckNumbers_billed.push(item[0].TruckNumber);

                    return (
                        <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                            <div className="col-md-2">
                                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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

                                            totalCHRG1_bill = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                                            locationWiseValue_del = locationWiseValue_del + values_del;
                                            if (handler.state.isClickedBilledItem == true && charge != 0) {
                                                TruckTypetotalValue_del = TruckTypetotalValue_del + values_del;
                                                TransporterTotal_billed = TransporterTotal_billed + values_del;
                                            }


                                            if (uniqueFromLocations_billed.indexOf(fromLocation) === -1) {
                                                uniqueFromLocations_billed.push(fromLocation);

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
                                    {uniqueFromLocations_billed.map((fromLocation) => {
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
                                {/* {uniqueFromLocations_del.length > 1 && ( */}
                                <div className="total_truck_block" id={`total-trucktype-billed-${key}`}>
                                    <p className="total_truck"> Total of Truck Type : </p>
                                    <p className="total_truck_value">{totalCHRG1_bill}</p>
                                </div>
                                {/* )} */}
                            </div>
                        </div>
                    );
                }
                else if (uniqueTruckNumbers_billed.indexOf(item[0].TruckNumber) !== -1) {
                    let TruckTypeLengthbilled = key - 1;
                    if (uniqueTruckNumbers_billed.indexOf(item[0].TruckNumber) !== -1) {
                        // setTimeout(() => {
                        $("#total-trucktype-billed-" + TruckTypeLengthbilled + "").hide();
                        // }, 100);
                    }
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

                                            totalCHRG2_bill = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                                            locationWiseValue_del = locationWiseValue_del + values_del;
                                            if (handler.state.isClickedBilledItem == true && charge != 0) {
                                                TruckTypetotalValue_del = TruckTypetotalValue_del + values_del;
                                                TransporterTotal_billed = TransporterTotal_billed + values_del;
                                            }

                                            if (uniqueFromLocations_billed.indexOf(fromLocation) === -1) {
                                                uniqueFromLocations_billed.push(fromLocation);

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
                                    {uniqueFromLocations_billed.map((fromLocation) => {
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
                                    <p className="total_truck_value">{totalCHRG1_bill + totalCHRG2_bill}</p>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        });

        const BilledSummeryUnMatchedPDFJsx: JSX.Element[] = handler.state.PDFUnmatchedBilledItem.map(function (item, key) {
            var locationWiseValue_del = 0;
            var TruckTypetotalValue_del = 0;
            var values = 0;
            var tripCount;
            var uniqueFromLocations_billed: any[] = [];
            var prevFromLocation: null = null;
            if (handler.state.isClickedBilledItem == true) {
                item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));
                if (unmatchedUniqueTruckNumbers_billed.indexOf(item[0].TruckNumber) === -1) {
                    unmatchedUniqueTruckNumbers_billed.push(item[0].TruckNumber);
                    return (
                        <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                            <div className="col-md-2">
                                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                                totalCHRG1_billUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                                                locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue

                                                if (handler.state.isClickedBilledItem == true && charge != 0) {
                                                    TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                                                    TransporterTotal_billed = TransporterTotal_billed + values;
                                                }

                                                if (uniqueFromLocations_billed.indexOf(fromLocation) === -1) {
                                                    // This is a new unique fromLocation, so add it to the array
                                                    uniqueFromLocations_billed.push(fromLocation);

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
                                    {uniqueFromLocations_billed.map((fromLocation) => {
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
                                <div className="total_truck_block" id={`total-trucktype-billedunmatch-${key}`}>
                                    <p className="total_truck"> Total of Truck Type : </p>
                                    <p className="total_truck_value">{totalCHRG1_billUnmatch}</p>
                                </div>
                                {/* )} */}

                            </div>
                        </div>
                    )
                }
                else if (unmatchedUniqueTruckNumbers_billed.indexOf(item[0].TruckNumber) !== -1) {
                    let TruckTypeLengthUnmatchBilled = key - 1;
                    if (unmatchedUniqueTruckNumbers_billed.indexOf(item[0].TruckNumber) !== -1) {
                        // setTimeout(() => {
                        $("#total-trucktype-billedunmatch-" + TruckTypeLengthUnmatchBilled + "").hide();
                        // }, 1000);
                    }

                    return (
                        <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                            <div className="col-md-2">
                                <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                                totalCHRG2_billUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                                                locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue
                                                if (handler.state.isClickedBilledItem == true && charge != 0) {
                                                    TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                                                    TransporterTotal_billed = TransporterTotal_billed + values;
                                                }

                                                if (uniqueFromLocations_billed.indexOf(fromLocation) === -1) {
                                                    // This is a new unique fromLocation, so add it to the array
                                                    uniqueFromLocations_billed.push(fromLocation);

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
                                                        </>
                                                    );
                                                }

                                            })}
                                    </tbody>


                                    {uniqueFromLocations_billed.map((fromLocation) => {
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
                                    <p className="total_truck_value">{totalCHRG1_billUnmatch + totalCHRG2_billUnmatch}</p>
                                </div>

                            </div>
                        </div>
                    )
                }
            }
        });

        const YetToBilledSummeryMatchedPDFJsx: JSX.Element[] = handler.state.PDFYetToBilledItem.map((item, key) => {
            var locationWiseValue_del = 0;
            var TruckTypetotalValue_del = 0;
            var values_del = 0;
            var tripCount;
            var uniqueFromLocations_yettobilled: any[] = [];
            var prevFromLocation: null = null;

            // if (handler.state.isClickedYetToBilledItem == true) {
            item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));

            if (UniqueTruckNumbers_yettobilled.indexOf(item[0].TruckNumber) === -1) {
                UniqueTruckNumbers_yettobilled.push(item[0].TruckNumber);
                return (
                    <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                        <div className="col-md-2">
                            <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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

                                        totalCHRG1_YetTobill = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                                        locationWiseValue_del = locationWiseValue_del + values_del;
                                        if (handler.state.isClickedBilledItem == false && charge != 0) {
                                            TruckTypetotalValue_del = TruckTypetotalValue_del + values_del;
                                            TransporterTotal_billed = TransporterTotal_billed + values_del;
                                        }


                                        if (uniqueFromLocations_yettobilled.indexOf(fromLocation) === -1) {
                                            uniqueFromLocations_yettobilled.push(fromLocation);
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
                                {uniqueFromLocations_yettobilled.map((fromLocation) => {
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
                            {/* {uniqueFromLocations_del.length > 1 && ( */}
                            <div className="total_truck_block  yet_Match" id={`total-trucktype-YetMatch-${key}`} style={{ display: hideTruckTypeIndex.indexOf(key) !== -1 ? 'none' : 'block' }}>
                                {/* <div className="total_truck_block yet_Match" id={`total-trucktype-YetMatch-${key}`} > */}
                                <p className="total_truck"> Total of Truck Type : </p>
                                <p className="total_truck_value">{totalCHRG1_YetTobill}</p>
                            </div>
                            {/* )} */}
                        </div>
                    </div>
                );
            }
            else if (UniqueTruckNumbers_yettobilled.indexOf(item[0].TruckNumber) !== -1) {
                let TruckTypeLengthYetMatch = key - 1;
                // hideTruckTypeIndex.push(TruckTypeLengthYetMatch);
                // if (UniqueTruckNumbers_yettobilled.indexOf(item[0].TruckNumber) !== -1) {
                $("#total-trucktype-YetMatch-" + (key - 1) + "").hide();

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

                                        totalCHRG2_YetTobill = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);
                                        locationWiseValue_del = locationWiseValue_del + values_del;
                                        if (handler.state.isClickedBilledItem == false && charge != 0) {
                                            TruckTypetotalValue_del = TruckTypetotalValue_del + values_del;
                                            TransporterTotal_billed = TransporterTotal_billed + values_del;
                                        }

                                        if (uniqueFromLocations_yettobilled.indexOf(fromLocation) === -1) {
                                            uniqueFromLocations_yettobilled.push(fromLocation);
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
                                {uniqueFromLocations_yettobilled.map((fromLocation) => {
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
                                <p className="total_truck_value">{totalCHRG1_YetTobill + totalCHRG2_YetTobill}</p>
                            </div>
                        </div>
                    </div>
                );
            }
            // }
        });

        const YetToBilledSummeryUnMatchedPDFJsx: JSX.Element[] = handler.state.PDFUnmatchedYetToBilledItem.map(function (item, key) {
            var locationWiseValue_del = 0;
            var TruckTypetotalValue_del = 0;
            var values = 0;
            var tripCount;
            var uniqueFromLocations_yettobilled: any[] = [];
            var prevFromLocation: null = null;
            // if (handler.state.isClickedBilledItem == false && handler.state.isClickedYetToBilledItem == true) {
            item.sort((a: { FromAddress: string; }, b: { FromAddress: any; }) => a.FromAddress.localeCompare(b.FromAddress));

            if (UnmatchedUniqueTruckNumbers_yettobilled.indexOf(item[0].TruckNumber) === -1) {
                UnmatchedUniqueTruckNumbers_yettobilled.push(item[0].TruckNumber);
                return (
                    <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                        <div className="col-md-2">
                            <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                            totalCHRG1_YetTobillUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                                            locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue

                                            if (handler.state.isClickedBilledItem == false && charge != 0) {
                                                TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                                                TransporterTotal_billed = TransporterTotal_billed + values;
                                            }

                                            if (uniqueFromLocations_yettobilled.indexOf(fromLocation) === -1) {
                                                // This is a new unique fromLocation, so add it to the array
                                                uniqueFromLocations_yettobilled.push(fromLocation);

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
                                {uniqueFromLocations_yettobilled.map((fromLocation) => {
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
                            <div className="total_truck_block" id={`total-trucktype_YetUnmatch${key}`}>
                                <p className="total_truck"> Total of Truck Type : </p>
                                <p className="total_truck_value">{totalCHRG1_YetTobillUnmatch}</p>
                            </div>
                            {/* )} */}
                        </div>
                    </div>
                )
            }
            else if (UnmatchedUniqueTruckNumbers_yettobilled.indexOf(item[0].TruckNumber) !== -1) {
                let TruckTypeLengthUnmatch = key - 1;
                if (UnmatchedUniqueTruckNumbers_yettobilled.indexOf(item[0].TruckNumber) !== -1) {
                    // this.hideTruckTypeIndex(TruckTypeLengthYetMatch);
                    // setTimeout(() => {
                    $("#total-trucktype_YetUnmatch" + TruckTypeLengthUnmatch + "").hide();
                    // }, 10);
                }
                return (
                    <div className="row table_row" key={`pdfTruckType-${item[0].TruckNumber}`}>
                        <div className="col-md-2">
                            <h4 className="table_heading"> Truck Type <span> {item[0].TruckNumber} </span> </h4>
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
                                            $("#total-trucktype_YetUnmatch" + TruckTypeLengthUnmatch + "").hide();
                                            tripCount = deliverItem.count;
                                            var charge = deliverItem.CHRG
                                            values = charge * tripCount; // Calculate the value
                                            var fromLocation = deliverItem.FromAddress;
                                            var toLocation = deliverItem.ToAddress;
                                            // values = deliverItem.Charge * tripcount; // Calculate the value
                                            totalCHRG2_YetTobillUnmatch = item.reduce((acc: number, deliverItem: { CHRG: number; count: number; }) => acc + deliverItem.CHRG * deliverItem.count, 0);

                                            locationWiseValue_del = locationWiseValue_del + values; // Accumulate locationWiseValue
                                            if (handler.state.isClickedBilledItem == false && charge != 0) {
                                                TruckTypetotalValue_del = TruckTypetotalValue_del + values; // Accumulate TruckTypetotalValue
                                                TransporterTotal_billed = TransporterTotal_billed + values;
                                            }

                                            if (uniqueFromLocations_yettobilled.indexOf(fromLocation) === -1) {
                                                // This is a new unique fromLocation, so add it to the array
                                                uniqueFromLocations_yettobilled.push(fromLocation);

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
                                                    </>
                                                );
                                            }

                                        })}
                                </tbody>


                                {uniqueFromLocations_yettobilled.map((fromLocation) => {
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
                                <p className="total_truck_value">{totalCHRG1_YetTobillUnmatch + totalCHRG2_YetTobillUnmatch}</p>
                            </div>

                        </div>
                    </div>
                )
            }
            // }
        });


        return (
            <>
                {
                    this.state.isBillingDashboard == true &&
                    <div className={styles.dnTransporterDashboard} >
                        <header className="attachement_header">
                            <div className="container">
                                <div className="header_first_section ">
                                    <div className="logo">
                                        <a href=""><img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Dn-logo.jpg" alt="img" /></a>
                                    </div>
                                    <div className="notification-part">
                                        <ul className="header-ul">
                                            {/* <li> <a href="" className="relative"> <img className="notification_img" src="https://tmxin.sharepoint.com/sites/POC/ClientPOC/SupplierPortal/SiteAssets/Supplier%20Portal%20Assets/img/notification.svg" alt="img" /> <span className="noto-count"> 1 </span> </a> </li> */}
                                            <li className="image"> <img className="user_img" src={`https://balmerlawries.sharepoint.com/sites/DN-Transport/_layouts/15/userphoto.aspx?&username=${this.state.CurrentUserEmail}`} alt="img" /> </li>
                                            {/* <li className="person-details"> <img className="user_img" src="https://tmxin.sharepoint.com/sites/POC/ClientPOC/SupplierPortal/SiteAssets/Supplier%20Portal%20Assets/img/user.png" alt="img" /> */}
                                            <li> {this.state.CurrentLoggedinuserNameState}  </li>
                                            <li className="dropdown-li" title="Open Menu" > <img onClick={this.signOut} src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/next.png" className="next_img" alt="img" />
                                            </li>
                                            <li className="SignOut-li">
                                                <a href="https://login.microsoftonline.com/common/oauth2/logout">Sign Out</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <section className="attachement_section billing_section" id="Load_content">
                            <div className="container invoice_container">
                                <div className='DN_heading'>
                                    <div className="table_heading clearfix">
                                        <h2> Billing Dashboard</h2>
                                    </div>
                                    <div className="bread-crums-part-btn-ctrols">
                                        <div className="bread-crums-part clearfix">
                                            <ul className="bread-crums-left">
                                                <li>
                                                    <ul className='dn_dash_header clearfix'>
                                                        <li onClick={() => this.gotoTransporterDashboard()}> <a href="#">Transporter </a>  </li>
                                                        <li className="active"> <a href="#">Billing </a> </li>

                                                    </ul>
                                                </li>
                                                {this.state.IsCurrentUserIsAdmin ?
                                                    <li className='transporter_name' style={{ float: "right", marginTop: "-20px" }}>
                                                        <label className="">Transporter Name:</label>
                                                        <select
                                                            value={selectedTransporter || ''}
                                                            onChange={(e) => this.setSelectedTransporter(e.target.value)}>
                                                            <option value="">Select Transporter</option>
                                                            {/* {transporterList.map((transporter) => (
                                                                <option key={transporter.id} value={transporter.name}>
                                                                    {transporter.name}
                                                                </option>
                                                            ))} */}
                                                            {transporterList.map((transporter) => (
                                                                <option value={transporter}>
                                                                    {transporter}
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
                                <div className="DN_dashboard_banner">
                                    <div className="Transporter_dashboard_block"></div>
                                    <div className="billing_dashboard_block">
                                        <div className="three-blocks-wrap">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="three-blocks">
                                                        <div className="three-blocks-img">
                                                            <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/total.svg" alt="image" data-themekey="#" /></div>
                                                        <div className="three-blocks-desc">
                                                            <h3> {this.state.TotalEntries} </h3>
                                                            <p> Total </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="three-blocks">
                                                        <div className="three-blocks-img">
                                                            <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Approved.svg" alt="image" data-themekey="#" /></div>
                                                        <div className="three-blocks-desc">
                                                            <h3> {this.state.TotalBilled} </h3>
                                                            <p> Total Billed </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="three-blocks">
                                                        <div className="three-blocks-img">
                                                            <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/pending.svg" alt="image" data-themekey="#" /></div>
                                                        <div className="three-blocks-desc">
                                                            <h3> {this.state.TotalPending} </h3>
                                                            <p> Total Yet to be Billed </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="search_block">
                                            <ul className="clearfix">
                                                <li className="date">
                                                    {/* <label className="">From</label> */}
                                                    <input
                                                        type="date"
                                                        id="txt-start-date"
                                                        className="form-control startdate"
                                                        autoComplete="off"
                                                        value={moment(this.state.startDate).format('YYYY-MM-DD')}
                                                        min="2024-02-01"
                                                        max={moment(this.state.endDate).format('YYYY-MM-DD')}
                                                        onChange={this.handleStartDateChange}
                                                    />
                                                    {/* <input type="date" className="form-control" autoComplete="off" /> */}
                                                </li>
                                                <li className="date">
                                                    {/* <label className="">To</label> */}
                                                    <input
                                                        type="date"
                                                        id="txt-end-date"
                                                        className="form-control"
                                                        autoComplete="off"
                                                        value={moment(this.state.endDate).format('YYYY-MM-DD')}
                                                        min={moment(this.state.startDate).format('YYYY-MM-DD')}
                                                        max={moment().format('YYYY-MM-DD')}
                                                        onChange={this.handleEndDateChange}
                                                        disabled={!this.state.startDateSelected} // Disable the end date input if start date is not selected
                                                    />
                                                    {/* <input type="date" className="form-control" autoComplete="off" /> */}
                                                </li>
                                                <li className={`apply_dates ${!this.state.startDateSelected ? 'btn_disable' : ''}`}>
                                                    <button onClick={(e) => this.Submitdates(e)}>Apply</button>
                                                </li>
                                                <li className='PDF_block'>
                                                    <div className="Reports_download" >
                                                        <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/download.svg" data-themekey="#" /> <span> Downloading... </span>
                                                    </div>
                                                    <div className={`select_report_btn ${this.state.reportClass}`}>
                                                        <select id="reportDropdown" onChange={(e) => this.handleReportSelection(e)} value={selectedReport || ''}>
                                                            <option value="">PDF Reports</option>
                                                            <option value="billed" onClick={this.deliveredBilledPDF}>  Summary Billed Report </option>
                                                            <option value="yettobilled" onClick={this.deliveredyettobilledPDF}>  Summary Yet to Bill Report </option>
                                                            <option value="billedconsolidated" onClick={this.downloadConsolidatedPDF}> Consolidated Report - Billed </option>
                                                            <option value="yettobilledconsolidated" onClick={this.downloadConsolidatedPDF}>Consolidated Report - Yet to Bill </option>
                                                        </select>
                                                    </div>
                                                </li>
                                                {/* <li>
                                                    {(this.state.DownloadingInprogress || this.state.DownloadingStatus === "Inprogress-B") ? (
                                                        // {(this.state.DownloadingInprogress && this.state.DownloadingInprogress == true) || this.props.Downloadstatus == "Inprogress" || DownloadingStatus == "Inprogress-B" ?
                                                        <div className="Reports_download">
                                                            <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/download.svg" data-themekey="#" /> <span> Downoading... </span>
                                                        </div>
                                                    ) :
                                                        <div className={`select_report_btn ${this.state.reportClass}`}
                                                        // className='select_report_btn'
                                                        >
                                                            <select id="reportDropdown" onChange={(e) => this.handleReportSelection(e)} value={selectedReport || ''}>
                                                                <option value="">PDF Reports</option>
                                                                <option value="billed" onClick={this.deliveredBilledPDF}>  Summary Billed Report </option>
                                                                <option value="yettobilled" onClick={this.deliveredyettobilledPDF}>  Summary Yet to Bill Report </option>
                                                                <option value="billedconsolidated" onClick={this.downloadConsolidatedPDF}> Consolidated Report - Billed </option>
                                                                <option value="yettobilledconsolidated" onClick={this.downloadConsolidatedPDF}>Consolidated Report - Yet to Bill </option>
                                                            </select>
                                                        </div>
                                                    }
                                                </li> */}
                                                {this.state.isDeliverdDN == true &&
                                                    <li className="comfirm_bill_btn">
                                                        <button onClick={(e) => this.ConfirmBilling(e)}> Confirm Billing </button>
                                                    </li>
                                                }


                                                {/* <li>
                                                    <div id="DNTable_filter" className="dataTables_filter"><label>Search:
                                                        <input type="search"
                                                            className="" placeholder="" aria-controls="DNTable" /></label></div>
                                                </li> */}
                                            </ul>
                                        </div>
                                        <div className="transport_trip_details_banner">
                                            <div className="DN_yettodel_tab">
                                                <ul className=" clearfix">
                                                    <li className="delivereddn"> <a href="#"> Delivered DN </a></li>
                                                    {/* <li className="yettodelivereddn" onClick={() => this.YetToDeleveredDNData()}> <a href="#"> Yet to Deliver </a></li> */}
                                                </ul>
                                            </div>
                                            <div className="transport_trip_details">
                                                {handler.state.isDeliverdDN == true &&
                                                    <div className="delivered_DN_banner">
                                                        {/* <div className="heading clearfix">
                                                        <h4> Delivered  DN </h4>
                                                    </div> */}
                                                        <div id='DNTable' className="table my-dntable" >
                                                            {DetailedDeliverPDFJsx}
                                                            {DetailedDeliverUnmatchedPDFJsx}
                                                        </div>
                                                        {handler.state.TotalEntries != 0 &&
                                                            <div className="total_truck_block  transport_totalvalue_block">
                                                                <p className="total_truck"> Transporter Total : </p>
                                                                <p className="total_truck_value"> {TransporterTotal_del} </p>
                                                            </div>
                                                        }
                                                    </div>
                                                }

                                                {/* {this.state.isYetToDeliverdDN == true &&
                                                    <div className="Yet_to_Deliver_banner">
                                                        {/* <div className="heading clearfix">
                                                        <h4> Yet to Deliver </h4>
                                                    </div> */}
                                                {/* <div id='DNTable' >
                                                            {DetailedPendingPDFJsx}
                                                            {DetailedPendingUnMatchedPDFJsx}
                                                        </div>
                                                        <div className="total_truck_block">
                                                            <p className="total_truck"> Transporter Total : </p>
                                                            <p className="total_truck_value"> {TransporterTotal_pen} </p>
                                                        </div> */}
                                                {/* </div>
                                                }  */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* billed summery and yet to billed */}
                        <div id='pdf-margin' style={{ marginTop: "500px", display: "none" }}></div>

                        <div id='bill' className='deliverPdf-details ' style={{ display: "none" }} >
                            {/* <div id='mypdf' className='deliverPdf-details ' style={{ display: "block" }} > */}

                            <header className="attachement_header">
                                <div className="container">
                                    <div className="header_first_section ">
                                        <div className="logo">
                                            <a href=""> <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/logo_img.svg" alt="img" /></a>
                                        </div>
                                        <div className="notification-part">
                                            <p className="date"> Date : <span>  {handler.state.CurrentDateTime_deliver} </span> </p>
                                            <p className="page_no"> Page No : <span> 1 </span></p>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <section className="attachement_section">
                                <div className="container">
                                    <div className="transport_trip_details_banner   Transporter_delivery_details">
                                        <h2> BILLED SUMMARY  </h2>
                                        <div className="transport_trip_details">
                                            <div className="heading clearfix">
                                                <h4> Transporter - <span>  {Transporter_Selected} </span> </h4>
                                                {/* <p> Transport Trip-Details For the Month - <span className="month"> {selectedDate} </span> </p> */}
                                            </div>

                                            <div id='deliver-pdf-data'>
                                                {BilledSummeryMatchedPDFJsx}
                                                {BilledSummeryUnMatchedPDFJsx}
                                            </div>

                                            {/* {detailedUniqueTruckNumbers_del.length != 0 && detailedUnmatchedUniqueTruckNumbers_del.length != 0 && */}
                                            <div className="total_truck_block transport_totalvalue_block">
                                                <p className="total_truck"> Transporter Total : </p>
                                                <p className="total_truck_value"> {TransporterTotal_billed} </p>
                                            </div>
                                            {/* } */}
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>

                        <div id='yettobill' className='yettobillPdf-details ' style={{ display: "none" }} >
                            {/* <div id='mypdf' className='deliverPdf-details ' style={{ display: "block" }} > */}

                            <header className="attachement_header">
                                <div className="container">
                                    <div className="header_first_section ">
                                        <div className="logo">
                                            <a href=""> <img src="https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/logo_img.svg" alt="img" /></a>
                                        </div>
                                        <div className="notification-part">
                                            <p className="date"> Date : <span>  {handler.state.CurrentDateTime_deliver} </span> </p>
                                            <p className="page_no"> Page No : <span> 1 </span></p>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <section className="attachement_section">
                                <div className="container">
                                    <div className="transport_trip_details_banner   Transporter_delivery_details">

                                        <h2> YET TO BILLED  SUMMARY  </h2>

                                        <div className="transport_trip_details">
                                            <div className="heading clearfix">
                                                <h4> Transporter - <span>  {Transporter_Selected} </span> </h4>
                                                {/* <p> Transport Trip-Details For the Month - <span className="month"> {selectedDate} </span> </p> */}
                                            </div>


                                            <div id='deliver-pdf-data'>
                                                {YetToBilledSummeryMatchedPDFJsx}
                                                {YetToBilledSummeryUnMatchedPDFJsx}
                                            </div>

                                            <div className="total_truck_block transport_totalvalue_block">
                                                <p className="total_truck"> Transporter Total : </p>
                                                <p className="total_truck_value"> {TransporterTotal_billed} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>





                        <section style={{ display: "none" }} id='loader_icon'>
                            <div>
                                <img src='https://balmerlawries.sharepoint.com/sites/DN-Transport/SiteAssets/Images/Spin-1s-100px%20(8).gif' alt='Loading...'></img>
                            </div>
                        </section>
                    </div >
                }
                {
                    this.state.isTransporterDashboard == true &&
                    <DnTransporterDashboard description={''} siteurl={this.props.siteurl} context={this.props.context} Percentage={''} Isdownloading={this.state.DownloadingInprogress} Downloadstatus={DownloadingStatus}></DnTransporterDashboard>
                }
            </>
        );
    }
}



