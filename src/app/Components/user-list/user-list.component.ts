import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from 'src/app/Models/user.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['position','name', 'email', 'role', 'actions'];
  searchQuery: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const users = this.userService.getUsers();
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator; // Attach paginator
    this.dataSource.sort = this.sort; // Attach sorting
  }

  filterUsers(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();

    // Reset to the first page after filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user: null }, // Passing null to indicate a new user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); // Reload the user list after adding a new user
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  confirmDelete(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this user?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.deleteUser(userId);
        this.snackBar.open('User deleted successfully!', 'Close', { duration: 3000 });
        this.loadUsers();
      }
    });
  }
}
