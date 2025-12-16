import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Yoga', 'Spinning', 'CrossFit', 'Pilates', 'Zumba', 'Funcional', 'Pesas', 'Cardio', 'Otro']
    },
    instructor: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['Baja', 'Media', 'Alta'],
        default: 'Media'
    },
    color: {
        type: String,
        default: '#8b5cf6'
    },
    maxCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Programada', 'En Curso', 'Completada', 'Cancelada'],
        default: 'Programada'
    }
}, {
    timestamps: true
});

export default mongoose.model('Class', classSchema);
