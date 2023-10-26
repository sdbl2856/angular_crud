import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeModel } from './employee-dashboard-model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  formValue!: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  showContent: boolean = true;
  showForm !: boolean;

  constructor(private formbuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      salary: [''],
    });

    this.getAllEmployee();
  }

  clickAddEmployee() {
    // this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = true;
    this.showContent = false;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false; // Set showForm to false to hide the form
    this.showContent = true;
  }



  postEmployeeDetails() {
    // Extract form values
    const firstName = this.formValue.value.firstName;
    const lastName = this.formValue.value.lastName;
    const email = this.formValue.value.email;
    const mobile = this.formValue.value.mobile;
    const salary = this.formValue.value.salary;

    // Check if any of the required fields are empty
    if (!firstName || !email || !mobile) {
      alert('Please fill out all required fields (First Name, Email, and Mobile Number).');
      return;
    }

    // Proceed with creating or updating the employee
    this.employeeModelObj.firstName = firstName;
    this.employeeModelObj.lastName = lastName;
    this.employeeModelObj.email = email;
    this.employeeModelObj.mobile = mobile;
    this.employeeModelObj.salary = salary;

    this.api.postEmployee(this.employeeModelObj).subscribe(
      (res) => {
        console.log(res);
        alert('Employee Added');
        this.formValue.reset();
        this.showForm = false; 
        this.showContent = true;
        this.getAllEmployee();
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  getAllEmployee() {
    this.api.getEmployee().subscribe(
      (res) => {
        this.employeeData = res;
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  deleteEmployee(row: any) {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');

    if (confirmDelete) {
      this.api.deleteEmployee(row.id).subscribe(
        (res) => {
          console.log(res);
          alert('Employee Deleted');
          this.showContent = true;
          this.getAllEmployee();
        },
        (err) => {
          alert('Something went wrong');
        }
      );
    }
  }

  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;

    this.employeeModelObj.id = row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['salary'].setValue(row.salary);
  }

  updateEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id).subscribe(
      (res) => {
        console.log(res);
        alert('Employee updated');
        this.formValue.reset();
        this.showContent = true;
        this.getAllEmployee();
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }
}
