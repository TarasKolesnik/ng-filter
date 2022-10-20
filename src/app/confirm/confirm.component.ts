import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IConfirm
{
    title?: string;
    message?: string;
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
            color?: 'primary' | 'accent' | 'warn';
        };
        cancel?: {
            show?: boolean;
            label?: string;
        };
    };
}


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IConfirm = {
      title: '',
      message: '',
      actions: {
        confirm: {
            show: false,
            label: '',
            color: 'primary',
        },
        cancel: {
            show: false,
            label: ''
        }
      }
    }
  ) { }

  ngOnInit(): void {
  }

}
