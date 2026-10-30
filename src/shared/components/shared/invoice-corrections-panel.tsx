'use client';
import { useEffect, useState } from 'react';
import { loadInvoiceCorrections, previewInvoiceCorrection, createInvoiceCorrection, recordInvoiceRefund } from '@/src/app/invoice-correction-actions';
import { CorrectionInput, euro } from '@/src/shared/lib/invoice-correction';

type Context = Awaited<ReturnType<typeof loadInvoiceCorrections>>;
type Preview = Awaited<ReturnType<typeof previewInvoiceCorrection>>;
export function InvoiceCorrectionsPanel({ orderId }: { orderId: number }) {
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState<Context | null>(null);
  const [form, setForm] = useState<CorrectionInput | null>(null);
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [url, setUrl] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refund, setRefund] = useState({ correctionId: '', paidAt: '', reference: '', confirmed: false });
  useEffect(() => {
    if (!preview) { setUrl(''); return; }
    const bytes = Uint8Array.from(atob(preview.pdf), c => c.charCodeAt(0));
    const blob = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    setUrl(blob); return () => URL.revokeObjectURL(blob);
  }, [preview]);
  async function refresh() {
    const value = await loadInvoiceCorrections(orderId); setCtx(value);
    setForm({ orderId, requestId: crypto.randomUUID(), mode: 'full', reason: '', customer: value.customer,
      originalAmount: value.originalAmount, legacyExemptConfirmed: false, originalChecked: true,
      lines: [{ description: '', amount: '' }] });
    setChecked(false); setConfirmed(false); setPreview(null);
  }
  async function run(fn: () => Promise<void>) {
    setPending(true); setError('');
    try { await fn(); } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось выполнить действие. Повторите попытку.'); }
    finally { setPending(false); }
  }
  function change(values: Partial<CorrectionInput>) { if (form) setForm({ ...form, ...values, requestId: crypto.randomUUID() }); setPreview(null); setConfirmed(false); }
  const field = 'border rounded p-2 w-full bg-white text-black';
  return <section className="mt-4 max-w-2xl rounded border p-4 space-y-3">
    <button type="button" className="font-semibold underline" disabled={pending} onClick={() => { setOpen(!open); if (!open) void run(refresh); }}>
      Stornorechnung · возвраты и отмена счёта
    </button>
    {open && <>
      <p className="text-sm">Документы создаются только после отдельного подтверждения. Доступно и для старых счетов. Дата выпуска — текущая.</p>
      {error && <p role="alert" className="text-red-700 whitespace-pre-wrap">{error}</p>}
      {notice && <p role="status" className="text-green-800">{notice}</p>}
      {!ctx && <button type="button" disabled={pending} onClick={() => void run(refresh)}>{pending ? 'Загрузка…' : 'Повторить загрузку'}</button>}
      {ctx && form && <>
        <a className="underline" target="_blank" rel="noopener noreferrer" href={ctx.originalUrl}>Открыть исходный Rechnung {ctx.originalNumber}</a>
        <fieldset disabled={pending} className="space-y-3">
          <p className="text-sm">Сверьте получателя и итог с исходным PDF. Данные заказа подставлены только для удобства. Для частичного возврата укажите товары, объём/количество и суммы после скидок; доставку при необходимости добавьте отдельной строкой.</p>
          <label className="block">Получатель и адрес из Rechnung<textarea className={field} value={form.customer} readOnly={ctx.locked} onChange={e => change({ customer: e.target.value })} rows={4} /></label>
          <label className="block">Полный итог исходного Rechnung, €<input className={field} inputMode="decimal" value={form.originalAmount} readOnly={ctx.locked || !ctx.legacy} onChange={e => change({ originalAmount: e.target.value })} /></label>
          <label className="block">Вид документа<select className={field} value={form.mode} onChange={e => change({ mode: e.target.value as 'full' | 'partial' })}>
            <option value="full">Полная отмена оставшейся суммы</option><option value="partial">Частичный возврат / уменьшение стоимости</option>
          </select></label>
          <label className="block">Причина на немецком (попадёт в PDF)<textarea className={field} value={form.reason} placeholder="Например: Rückgabe der Ware" onChange={e => change({ reason: e.target.value })} /></label>
          {form.mode === 'partial' && <div className="space-y-2">{form.lines.map((line, index) => <div className="border rounded p-2 space-y-2" key={index}>
            <label className="block">Позиция {index + 1}: товар, объём и количество на немецком<input className={field} value={line.description} onChange={e => change({ lines: form.lines.map((l, i) => i === index ? { ...l, description: e.target.value } : l) })} /></label>
            <label className="block">Возвращаемая сумма, €<input className={field} inputMode="decimal" value={line.amount} onChange={e => change({ lines: form.lines.map((l, i) => i === index ? { ...l, amount: e.target.value } : l) })} /></label>
            <button type="button" onClick={() => change({ lines: form.lines.filter((_, i) => i !== index) })}>Удалить строку</button>
          </div>)}<button type="button" disabled={form.lines.length >= 30} onClick={() => change({ lines: [...form.lines, { description: '', amount: '' }] })}>+ Добавить позицию / доставку</button></div>}
          {ctx.legacy && !ctx.locked && <label className="flex gap-2"><input type="checkbox" checked={form.legacyExemptConfirmed} onChange={e => change({ legacyExemptConfirmed: e.target.checked })} />В исходном PDF указано освобождение по § 19 UStG, НДС не выделен.</label>}
          <label className="flex gap-2"><input type="checkbox" checked={checked} onChange={e => { setChecked(e.target.checked); setPreview(null); setConfirmed(false); }} />Я сверил исходный PDF, реквизиты, суммы, скидки и предыдущие возвраты. Указанный возврат согласован.</label>
          <button type="button" className="border rounded px-4 py-2" disabled={!checked || (ctx.legacy && !ctx.locked && !form.legacyExemptConfirmed)} onClick={() => void run(async () => { setPreview(await previewInvoiceCorrection({ ...form, lines: form.mode === 'full' ? [] : form.lines })); setConfirmed(false); })}>Предпросмотр без выпуска</button>
          {preview && <div className="border rounded p-3 space-y-3">
            <p>Сумма корректировки: <strong>{euro(preview.grossCents)}</strong></p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline">Открыть PDF-черновик</a>
            <label className="flex gap-2"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />Подтверждаю выпуск Stornorechnung. После выпуска документ нельзя редактировать или удалить.</label>
            <button type="button" className="bg-black text-white rounded px-4 py-2" disabled={!confirmed || !checked} onClick={() => void run(async () => {
              const result = await createInvoiceCorrection({ ...form, lines: form.mode === 'full' ? [] : form.lines }, preview.previewHash, confirmed);
              setNotice(`Документ ${result.number} выпущен. Возврат денег и отправка клиенту выполняются отдельно.`);
              await refresh();
            })}>Выпустить Stornorechnung</button>
          </div>}
        </fieldset>
        <h3 className="font-semibold">Выпущенные документы</h3>
        {!ctx.corrections.length && <p>Отменных документов пока нет.</p>}
        {ctx.corrections.map(c => <article key={c.id} className="border rounded p-3 space-y-2">
          <a href={`/api/invoice-corrections/${c.id}`} className="underline">Скачать {c.number}</a>
          <p>{euro(c.grossCents)} · {new Intl.DateTimeFormat('ru', { timeZone: 'Europe/Berlin' }).format(new Date(c.issuedAt))}</p>
          {c.refund ? <p>Возврат отмечен: {c.refund.paidAt} · {c.refund.reference}</p> : <>
            <p>Возврат денег не отмечен.</p>
            <button type="button" disabled={pending} onClick={() => setRefund({ correctionId: c.id, paidAt: '', reference: '', confirmed: false })}>Отметить выполненный банковский перевод</button>
            {refund.correctionId === c.id && <fieldset disabled={pending} className="space-y-2">
              <label className="block">Дата перевода<input type="date" className={field} value={refund.paidAt} onChange={e => setRefund({ ...refund, paidAt: e.target.value })} /></label>
              <label className="block">Номер операции / ссылка на банковский документ<input className={field} value={refund.reference} onChange={e => setRefund({ ...refund, reference: e.target.value })} /></label>
              <label className="flex gap-2"><input type="checkbox" checked={refund.confirmed} onChange={e => setRefund({ ...refund, confirmed: e.target.checked })} />Я самостоятельно вернул полную сумму этого документа ({euro(c.grossCents)}) и проверил дату и номер операции.</label>
              <button type="button" disabled={!refund.confirmed} onClick={() => void run(async () => { await recordInvoiceRefund(refund); setRefund({ correctionId: '', paidAt: '', reference: '', confirmed: false }); setCtx(await loadInvoiceCorrections(orderId)); setNotice('Выполненный перевод отмечен. Деньги через сайт не переводились.'); })}>Сохранить отметку о переводе</button>
            </fieldset>}
          </>}
        </article>)}
      </>}
      {pending && <p role="status">Выполняется…</p>}
    </>}
  </section>;
}
