public with sharing class EmployeeController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeList(Id recordId) {
        return [
            SELECT Id, Name, Email__c, Account__r.Name
            FROM Employee__c
            WHERE Account__c = :recordId
            LIMIT 10
        ];
    }
}
