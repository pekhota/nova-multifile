import IndexField from './components/IndexField'
import DetailField from './components/DetailField'
import FormField from './components/FormField'

Nova.booting((app, store) => {
  app.component('index-nova-multifile', IndexField)
  app.component('detail-nova-multifile', DetailField)
  app.component('form-nova-multifile', FormField)
})
