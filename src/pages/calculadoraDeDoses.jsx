import { useState, useEffect } from 'react';
import './styles.css'

const medicamentosPadrao = [
  { nome: 'Noradrenalina', volDroga: 16, concDroga: 1000, volSolucao: 250, volSoro: 234, min: 0.05, max: 2, unidade: 'mcg/kg/min' },
  { nome: 'Vasopressina', volDroga: 2, concDroga: 10, volSolucao: 100, volSoro: 98, min: 0.01, max: 0.04, unidade: 'UI/min', pesoIndependente: true },
  { nome: 'Adrenalina', volDroga: 12, concDroga: 1000, volSolucao: 200, volSoro: 188, min: 0.1, max: 2, unidade: 'mcg/kg/min' },
  { nome: 'Dopamina', volDroga: 50, concDroga: 5000, volSolucao: 250, volSoro: 200, min: 5, max: 20, unidade: 'mcg/kg/min' },
  { nome: 'Dobutamina', volDroga: 20, concDroga: 12500, volSolucao: 250, volSoro: 230, min: 5, max: 20, unidade: 'mcg/kg/min' },
  { nome: 'Tridil', volDroga: 10, concDroga: 50000, volSolucao: 250, volSoro: 240, min: 5, max: 200, unidade: 'mcg/min' },
  { nome: 'Nipride', volDroga: 2, concDroga: 25000, volSolucao: 250, volSoro: 248, min: 0.5, max: 10, unidade: 'mcg/kg/min' },
];

export default function CalculadoraDeDoses() {
  const [peso, setPeso] = useState(parseFloat(localStorage.getItem('peso')) || 70);
  const [usarPersonalizado, setUsarPersonalizado] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [medicamentoPersonalizado, setMedicamentoPersonalizado] = useState({
    nome: '',
    volDroga: '',
    concDroga: '',
    volSolucao: '',
    unidade: 'mcg/kg/min',
  });
  const [dose, setDose] = useState('');
  const [mlh, setMlh] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    localStorage.setItem('peso', peso);
    calcularDose();
  }, [dose, mlh, peso, medicamentoSelecionado, medicamentoPersonalizado, usarPersonalizado]);

  const validarEntrada = (valor) => {
    const num = parseFloat(valor);
    return !isNaN(num) && num >= 0;
  };

  const calcularDose = () => {
    const medicamento = usarPersonalizado ? medicamentoPersonalizado : medicamentoSelecionado;
    if (!medicamento || (!validarEntrada(dose) && !validarEntrada(mlh))) {
      setResultado('Entrada inválida. Insira valores válidos.');
      return;
    }

    const { volDroga, concDroga, volSolucao, unidade, pesoIndependente, min, max } = medicamento;
    let res;

    if (validarEntrada(dose)) {
      res = ((dose * (pesoIndependente ? 1 : peso) * (unidade.includes('min') ? 60 : 1) * volSolucao) / (concDroga * volDroga)).toFixed(2) + ' ml/h';
    } else if (validarEntrada(mlh)) {
      res = ((mlh * concDroga * volDroga) / ((pesoIndependente ? 1 : peso) * (unidade.includes('min') ? 60 : 1) * volSolucao)).toFixed(2) + ' ' + unidade;
    }

    setResultado(`Resultado: ${res} - Dose Min-Max: ${min} a ${max} ${unidade}`);
  };

  return (
    <div className="conteinerCalculadora">
      <h2 className="calculadoraTitulo">Calculadora de Doses</h2>
      <div className="calculadoraPeso">
        <label className="block font-semibold text-lg">Peso:  </label>
         <input type="number" className="border p-2 w-full rounded" value={peso} onChange={(e) => setPeso(parseFloat(e.target.value) || '')} /> kg
      </div>
      {usarPersonalizado ? (
        <div className="CalculadoraPersonalizado">
          Nome do Medicamento: <input type="text" placeholder="" className="border p-2 w-full rounded"
            value={medicamentoPersonalizado.nome} onChange={(e) => setMedicamentoPersonalizado({ ...medicamentoPersonalizado, nome: e.target.value })} />
          <br/>
          Volume da Droga (ml): <input type="number" placeholder="" className="border p-2 w-full rounded"
            value={medicamentoPersonalizado.volDroga} onChange={(e) => setMedicamentoPersonalizado({ ...medicamentoPersonalizado, volDroga: parseFloat(e.target.value) || '' })} />
          <br/>
          Concentração da Droga (mcg/ml): <input type="number" placeholder="" className="border p-2 w-full rounded"
            value={medicamentoPersonalizado.concDroga} onChange={(e) => setMedicamentoPersonalizado({ ...medicamentoPersonalizado, concDroga: parseFloat(e.target.value) || '' })} />
          <br/>
          Volume da Solução (ml): <input type="number" placeholder="" className="border p-2 w-full rounded"
            value={medicamentoPersonalizado.volSolucao} onChange={(e) => setMedicamentoPersonalizado({ ...medicamentoPersonalizado, volSolucao: parseFloat(e.target.value) || '' })} />
        </div>
      ) : (
       <div>
         <select className="CalculadoraPersonalizado" onChange={(e) => setMedicamentoSelecionado(medicamentosPadrao[e.target.value])}>
          <option value="">Selecione um medicamento</option>
          {medicamentosPadrao.map((med, index) => (
            <option key={index} value={index}>{med.nome} ({med.unidade}) <span> -- Diluição: {med.volDroga} de {med.nome} + {med.volSoro}ml de soro. </span> </option> 
          ))}
        </select>
          
        </div>
        
      )}
      <div className="calculadoraMedicamento">
        <label>
          <input type="checkbox" checked={usarPersonalizado} onChange={() => setUsarPersonalizado(!usarPersonalizado)} /> Usar Medicação Personalizada
        </label>
      </div>

      <div className="CalculadoraPersonalizado">
        <label className="block font-semibold text-lg mt-2">Velocidade de infusão: </label>
        <input type="number" className="border p-2 w-full rounded" value={mlh} onChange={(e) => { setMlh(e.target.value); setDose(''); }} disabled={dose} />
        <br/>
        ou
        <br/>
        <label className="block font-semibold text-lg">Dose: </label>
        <input type="number" className="border p-2 w-full rounded" value={dose} onChange={(e) => { setDose(e.target.value); setMlh(''); }} disabled={mlh} />
      </div>

      <div className="CalculadoraPersonalizado">{resultado}</div>
    </div>
  );
}
