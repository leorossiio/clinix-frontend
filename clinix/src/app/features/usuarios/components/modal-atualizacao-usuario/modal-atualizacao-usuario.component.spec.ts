import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAtualizacaoUsuarioComponent } from './modal-atualizacao-usuario.component';

describe('ModalAtualizacaoUsuarioComponent', () => {
  let component: ModalAtualizacaoUsuarioComponent;
  let fixture: ComponentFixture<ModalAtualizacaoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAtualizacaoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAtualizacaoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
