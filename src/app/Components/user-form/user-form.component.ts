import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/Models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] = ['Admin', 'User'];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialog: MatDialog) { 
      this.userForm = this.fb.group({
        name: [this.data?.user?.name || '', Validators.required],
        email: [this.data?.user?.email || '', [Validators.required, Validators.email]],
        role: [this.data?.user?.role || '', Validators.required]
      });
  }

  ngOnInit(): void {}

  saveUser(): void {
    if (this.userForm.valid) {
      const user: User = { ...this.userForm.value, id: this.data?.user?.id || null };
      const action = this.data?.user ? 'updated' : 'added';
  
      // Open confirmation dialog
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmation',
          message: `Are you sure you want to ${action} this user?`
        }
      });
  
      // Wait for dialog result
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          // Proceed with saving the user if confirmed
          if (this.data?.user) {
            this.userService.updateUser(user);
          } else {
            this.userService.addUser(user);
          }
  
          // Close the form dialog
          this.dialogRef.close(true);
  
          // Show success confirmation dialog
          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Success',
              message: `User has been successfully ${action}!`
            }
          });
        }
      });
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
