import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasLargo } from './metas-largo';

describe('MetasLargo', () => {
  let component: MetasLargo;
  let fixture: ComponentFixture<MetasLargo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetasLargo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetasLargo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
