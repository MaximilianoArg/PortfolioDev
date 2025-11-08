import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Desloguear } from './desloguear';

describe('Desloguear', () => {
  let component: Desloguear;
  let fixture: ComponentFixture<Desloguear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Desloguear]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Desloguear);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
