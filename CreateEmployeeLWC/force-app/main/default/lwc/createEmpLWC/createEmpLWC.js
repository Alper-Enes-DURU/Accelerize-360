import { LightningElement, track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import uiRecordApi to create record
import { createRecord } from 'lightning/uiRecordApi';
// importing to show toast notifictions
//import saveAccountRecord from '@salesforce/apex/AccountLWCExampleController.saveAccountRecord'

// importing Account fields
//import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import EMPLOYEE__C_OBJECT from '@salesforce/schema/Employee__c';
import ACCOUNT__C_FIELD from '@salesforce/schema/Employee__c.Account__c';
import NAME_FIELD from '@salesforce/schema/Employee__c.Name';
import EMAIL_FIELD from '@salesforce/schema/Employee__c.Email__c';

export default class CreateRecordInLWC extends LightningElement {
    @track error;
    @track id = ACCOUNT__C_FIELD;
    @api recordId;
    @track currenRecordId;
    // this object have record information
    @track empRecord = {
        Name : NAME_FIELD,
        Email : EMAIL_FIELD,
        Account__c : this.recordId,
    };

    handleIdChange(event) {
        this.empRecord.Account__c = event.target.value;
    }

    handleNameChange(event) {
        this.empRecord.Name = event.target.value;
        window.console.log('Name ==> '+this.empRecord.Name);
    }

    handleEmailChange(event) {
        this.empRecord.Email = event.target.value;
        window.console.log('Email ==> '+this.empRecord.Email);
        window.console.log('object ==> '+JSON.stringify(EMPLOYEE__C_OBJECT));
    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.apiName + ' created.',
                variant: 'success',
            }),
        );
    }

    handleChange(event) {
        console.log("You selected an account: " + event.detail.value[0]);
    }

    handleSave() {
        const fields = {};

        fields[NAME_FIELD.fieldApiName] = this.empRecord.Name;
        fields[EMAIL_FIELD.fieldApiName] = this.empRecord.Email;
        fields[ACCOUNT__C_FIELD.fieldApiName] = this.empRecord.Account__c;
       
        // Creating record using uiRecordApi
        let recordInput = { apiName: EMPLOYEE__C_OBJECT.objectApiName, fields }
        createRecord(recordInput)
        .then(result => {
            // Clear the user enter values
            this.empRecord = {};

            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Employee Created Successfully!!',
                variant: 'success'
            }),);
        })
        .catch(error => {
            this.error = JSON.stringify(error);
        });
    }
}