import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IHeaderAngularComp} from 'ag-grid-angular';
import {type IHeaderParams} from 'ag-grid-community';
import {TourAnchorTuiHintDirective} from 'ngx-ui-tour-tui-hint';

interface TourHeaderParams extends IHeaderParams {
    readonly tourAnchor?: string;
}

@Component({
    selector: 'tour-header',
    imports: [TourAnchorTuiHintDirective],
    template: `
        <span class="header" [tourAnchor]="anchorId">
            {{ displayName }}
        </span>
    `,
    styles: `
        :host,
        .header {
            display: flex;
            align-items: center;
            inline-size: 100%;
            block-size: 100%;
            font-weight: 600;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourHeaderComponent implements IHeaderAngularComp {
    protected displayName = '';
    protected anchorId = '';

    public agInit(params: IHeaderParams): void {
        this.update(params);
    }

    public refresh(params: IHeaderParams): boolean {
        this.update(params);

        return true;
    }

    private update(params: IHeaderParams): void {
        const tourParams = params as TourHeaderParams;

        this.displayName = tourParams.displayName;
        this.anchorId = tourParams.tourAnchor ?? '';
    }
}
