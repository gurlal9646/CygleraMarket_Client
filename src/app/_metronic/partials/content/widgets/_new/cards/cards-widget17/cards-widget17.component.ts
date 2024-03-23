import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../../kt/_utils';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-cards-widget17',
  templateUrl: './cards-widget17.component.html',
  styleUrls: ['./cards-widget17.component.scss'],
})
export class CardsWidget17Component implements OnInit {
  @Input() cssClass: string = '';
  @Input() approved: number = 70;
  @Input() rejected: number = 11;
  @Input() pending?: number = 145;

  constructor() {}

  ngOnInit(): void {
    const ctx = document.getElementById('donutChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [{
          label: '# of Requests',
          data: [this.approved, this.rejected, this.pending],
          backgroundColor: [
            'rgb(0, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 205, 86)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

  }

}

