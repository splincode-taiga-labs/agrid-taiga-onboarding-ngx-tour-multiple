import {Injectable} from '@angular/core';
import {type GridApi} from 'ag-grid-community';

import {TravelPlanDto} from '../proposal.dto';

@Injectable()
export class GridNavigationService {
    private gridApi: GridApi<TravelPlanDto> | null = null;

    public setGridApi(gridApi: GridApi<TravelPlanDto>): void {
        this.gridApi = gridApi;
    }

    public showColumn(field: string): void {
        this.gridApi?.ensureColumnVisible(field);
    }

    public showRow(id: number): void {
        this.gridApi?.forEachNode((node) => {
            if (node.data?.id === id) {
                this.gridApi?.ensureNodeVisible(node, 'middle');
            }
        });
    }
}
