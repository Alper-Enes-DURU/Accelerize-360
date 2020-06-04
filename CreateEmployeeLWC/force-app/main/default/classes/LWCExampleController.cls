public with sharing class LWCExampleController {
    @AuraEnabled
    public static void saveAccountRecord(Employee__c emp){
        try{
            insert emp;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}
