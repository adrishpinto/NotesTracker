import { Schema, model, Document } from 'mongoose';

interface INote extends Document {
  content: string;
  email: string;
}

const noteSchema = new Schema<INote>({
  content: { type: String, required: true },
  email: { type: String, required: true }
});

const Note = model<INote>('Note', noteSchema);

export default Note;