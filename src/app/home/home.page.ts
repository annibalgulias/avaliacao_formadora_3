import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isModalOpen = false;
  userEmail: string | null = null;
  tasks: any[] = [];

  currentTaskId: number | null = null;
  currentTaskTitle: string = '';
  currentTaskDescription: string = '';
  currentTaskPriority: string = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AutheticationService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        this.userEmail = null;
      }
    });
  }

  openAddModal() {
    this.currentTaskId = null;
    this.currentTaskTitle = '';
    this.currentTaskDescription = '';
    this.currentTaskPriority = '';
    this.isModalOpen = true;
  }

  editTask(task: any) {
    this.currentTaskId = task.id;
    this.currentTaskTitle = task.title;
    this.currentTaskDescription = task.description;
    this.currentTaskPriority = task.priority;
    this.isModalOpen = true;
  }

  saveTask() {
    if (this.currentTaskId === null) {
      this.addTask(this.currentTaskTitle, this.currentTaskDescription, this.currentTaskPriority,);
    } else {
      this.updateTask(this.currentTaskTitle, this.currentTaskDescription, this.currentTaskPriority,);
    }
    this.closeModal();
  }

  addTask(title: string, description: string, priority: string) {
    const newTask = {
      id: this.tasks.length + 1,
      title,
      description,
      priority
    };
    this.tasks.push(newTask);
  }

  updateTask(title: string, description: string, priority: string) {
    if (this.currentTaskId !== null) {
      const taskIndex = this.tasks.findIndex(task => task.id === this.currentTaskId);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
          id: this.currentTaskId,
          title,
          description,
          priority
        };
      }
      this.currentTaskId = null;
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentTaskId = null;
    this.currentTaskTitle = '';
    this.currentTaskDescription = '';
    this.currentTaskPriority = '';
  }

  logoutUser() {
    this.authService.logoutUser().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Erro ao deslogar: ', error);
    });
  }
}