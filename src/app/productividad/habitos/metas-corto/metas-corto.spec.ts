import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasCorto } from './metas-corto';

describe('MetasCorto', () => {
  let component: MetasCorto;
  let fixture: ComponentFixture<MetasCorto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetasCorto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetasCorto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
