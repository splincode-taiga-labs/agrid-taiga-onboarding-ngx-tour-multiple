import {Injectable, signal} from '@angular/core';

import {TravelPlanDto} from '../../proposal.dto';

@Injectable()
export class TravelNotesSidebarService {
    public readonly travelPlan = signal<TravelPlanDto | null>(null);
    public readonly opened = signal(false);

    public open(travelPlan: TravelPlanDto): void {
        this.travelPlan.set(travelPlan);
        this.opened.set(true);
    }

    public close(): void {
        this.opened.set(false);
        this.travelPlan.set(null);
    }
}
