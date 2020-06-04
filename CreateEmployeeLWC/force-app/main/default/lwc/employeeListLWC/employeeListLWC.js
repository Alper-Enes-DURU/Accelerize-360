import { LightningElement, wire, track, api } from 'lwc';
import getEmployeeList from '@salesforce/apex/EmployeeController.getEmployeeList';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Employee__c.Name';
import EMAIL_FIELD from '@salesforce/schema/Employee__c.Email__c';
//import EMPLOYEE__C_OBJECT from '@salesforce/schema/Employee__c';
import ACCOUNT__C_FIELD from '@salesforce/schema/Employee__c.Account__r.Name';
import ID_FIELD from '@salesforce/schema/Employee__c.Id';

const columns = [
    { label: 'Employee Name', fieldName: 'Name', editable: true },
    { label: 'Account', fieldName: 'Account__c', type: 'text'},
    { label: 'Email', fieldName: 'Email__c', type: 'email' }
];

export default class EmployeeListLWC extends LightningElement {

    @track error;
    @track columns = columns;
   @track data = [];
    @track draftValues = [];
    @api recordId;
    @wire(getEmployeeList, {recordId: '$recordId' })
   // employee;
    wiredRecordsMethod({error, data}){
        if(data){
            let currentData = [];
            data.forEach((row) =>{
                let rowData = {};
                rowData.Name = row.Name;
                rowData.Email__c = row.Email__c;
                rowData.Account__c = row.Account__r.Name;
                currentData.push(rowData);
            });
            this.data = currentData;
        }
        else if(error){
            window.console.log(error);
        }
    }

    handleSave(event) {

        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        fields[EMAIL_FIELD.fieldApiName] = event.detail.draftValues[0].Email__c;
        fields[ACCOUNT__C_FIELD.fieldApiName] = event.detail.draftValues[0].Account__r.Name;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Employee updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];

            // Display fresh data in the datatable
            return refreshApex(this.employee);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}