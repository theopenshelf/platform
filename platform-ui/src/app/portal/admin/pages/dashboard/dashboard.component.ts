import { Component } from '@angular/core';
import { TuiAxes, TuiLineChart, TuiLineChartHint } from '@taiga-ui/addon-charts';
import { TuiContext } from '@taiga-ui/cdk';
import { TuiHint, TuiPoint } from '@taiga-ui/core';

@Component({
  imports: [TuiAxes, TuiLineChart, TuiHint, TuiLineChartHint],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  protected readonly labelsX = ['Jan 2019', 'Feb', 'Mar', ''];
  protected readonly axisYLabels = ['', '25%', '50%', '75%', '100%'];

  protected readonly value: readonly TuiPoint[] = [
    [50, 50],
    [100, 75],
    [150, 50],
    [200, 150],
    [250, 155],
    [300, 190],
    [350, 90],
  ];

  protected readonly stringify = String;

  protected readonly hintContent = ({
    $implicit,
  }: TuiContext<readonly TuiPoint[]>): number => $implicit[0]?.[1] ?? 0;
}
