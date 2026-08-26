import {DestroyRef, inject, Injectable} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {WA_LOCAL_STORAGE} from '@ng-web-apis/common';
import {type IStepOption, TourService} from 'ngx-ui-tour-tui-hint';

import {GridNavigationService} from '../grid/grid-navigation.service';
import {type TourResult} from '../tour-result';

export const TRIP_PLANNING_TOUR_ANCHORS = {
    country: 'trip-planning-country',
    season: 'trip-planning-season',
    duration: 'trip-planning-duration',
} as const;

export const TRIP_PLANNING_TOUR_STEPS = {
    country: 'trip-planning-country-step',
    season: 'trip-planning-season-step',
    duration: 'trip-planning-duration-step',
} as const;

const STORAGE_KEY = '@onboarding.trip-planning.v1';
const COMPLETED_STATE = 'completed';

const STEPS: IStepOption[] = [
    {
        stepId: TRIP_PLANNING_TOUR_STEPS.country,
        anchorId: TRIP_PLANNING_TOUR_ANCHORS.country,
        placement: 'bottom',
        enableBackdrop: true,
        isAsync: true,
    },
    {
        stepId: TRIP_PLANNING_TOUR_STEPS.season,
        anchorId: TRIP_PLANNING_TOUR_ANCHORS.season,
        placement: 'bottom',
        enableBackdrop: true,
        isAsync: true,
    },
    {
        stepId: TRIP_PLANNING_TOUR_STEPS.duration,
        anchorId: TRIP_PLANNING_TOUR_ANCHORS.duration,
        placement: 'bottom',
        enableBackdrop: true,
        isAsync: true,
    },
];

@Injectable()
export class TripPlanningTourService {
    private readonly localStorage = inject(WA_LOCAL_STORAGE);
    private readonly navigation = inject(GridNavigationService);
    private readonly tour = inject(TourService);
    private resolveRun: ((result: TourResult) => void) | null = null;

    public constructor() {
        this.tour.end$
            .pipe(takeUntilDestroyed(inject(DestroyRef)))
            .subscribe(() => this.finishFromExternalEnd());
    }

    public run(ignoreCompleted = false): Promise<TourResult> {
        if (
            !ignoreCompleted &&
            this.localStorage.getItem(STORAGE_KEY) === COMPLETED_STATE
        ) {
            return Promise.resolve('skipped');
        }

        if (this.tour.currentStep) {
            this.tour.end();
        }

        this.navigation.showColumn('country');
        this.tour.initialize(STEPS, {
            disablePageScrolling: true,
            showProgress: false,
            stepDimensions: {
                width: 'min(29rem, calc(100vw - 1rem))',
                maxWidth: 'calc(100vw - 1rem)',
            },
        });

        return new Promise<TourResult>((resolve) => {
            this.resolveRun = resolve;
            this.tour.start();
        });
    }

    public owns(step: IStepOption | undefined): boolean {
        return !!step && Object.values(TRIP_PLANNING_TOUR_STEPS).includes(
            step.stepId as (typeof TRIP_PLANNING_TOUR_STEPS)[keyof typeof TRIP_PLANNING_TOUR_STEPS],
        );
    }

    public next(): void {
        switch (this.tour.currentStep?.stepId) {
            case TRIP_PLANNING_TOUR_STEPS.country:
                this.navigation.showColumn('season');
                break;
            case TRIP_PLANNING_TOUR_STEPS.season:
                this.navigation.showColumn('durationDays');
                break;
            default:
                break;
        }

        this.tour.next();
    }

    public complete(): void {
        this.finish('completed');
    }

    public dismiss(): void {
        this.finish('dismissed');
    }

    private finish(result: Exclude<TourResult, 'skipped'>): void {
        const resolve = this.resolveRun;

        if (!resolve) {
            return;
        }

        this.resolveRun = null;
        this.localStorage.setItem(STORAGE_KEY, COMPLETED_STATE);
        this.tour.end();
        resolve(result);
    }

    private finishFromExternalEnd(): void {
        const resolve = this.resolveRun;

        if (!resolve) {
            return;
        }

        this.resolveRun = null;
        this.localStorage.setItem(STORAGE_KEY, COMPLETED_STATE);
        resolve('dismissed');
    }
}
