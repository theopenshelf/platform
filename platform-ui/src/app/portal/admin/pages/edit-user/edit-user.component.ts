import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User, UsersService } from '../../services/users.service';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  standalone: true,
  selector: 'app-edit-user',
  imports: [
    CommonModule,
    RouterLink,
    TuiButton,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  user: User = {} as User;
  editUserForm: FormGroup;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private fb: FormBuilder,
    private alerts: TuiAlertService,
    private router: Router
  ) {
    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      flatNumber: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.user = this.usersService.getUser(this.userId);
      this.editUserForm.patchValue(this.user);
    } else {
      this.editUserForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        flatNumber: [''],
        address: ['']
      });
    }
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      const updatedUser = this.editUserForm.value;
      updatedUser.id = this.user.id;
      this.user.username = updatedUser.username;
      this.user.email = updatedUser.email;
      this.user.flatNumber = updatedUser.flatNumber;
      this.user.address = updatedUser.address;
      this.usersService.saveUser( this.user);
      this.alerts.open(`Successfully saved ${this.user.username}`, { appearance: 'positive' }).subscribe();
      this.router.navigate(['/admin/users']);
    }
  }
}
