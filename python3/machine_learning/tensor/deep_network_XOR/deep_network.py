import tensorflow as tf
import numpy as np

xy = np.loadtxt('train.txt', unpack=True, dtype='float32')
x_data = np.transpose(xy[0:-1])
y_data = np.reshape(xy[-1], (4, 1))

print(x_data)
print(y_data)

X = tf.placeholder(tf.float32, name='X-input')
Y = tf.placeholder(tf.float32, name='Y-input')

y_hist = tf.histogram_summary('y', Y)

W1 = tf.Variable(tf.random_uniform([2, 5], -1.0, 1.0), name='Weight1')
W2 = tf.Variable(tf.random_uniform([5, 4], -1.0, 1.0), name='Weight2')
W3 = tf.Variable(tf.random_uniform([4, 1], -1.0, 1.0), name='Weight3')

w1_hist = tf.histogram_summary('weights1', W1)
w2_hist = tf.histogram_summary('weights2', W2)
w3_hist = tf.histogram_summary('weights3', W3)

b1 = tf.Variable(tf.zeros([5]), name="Bias1")
b2 = tf.Variable(tf.zeros([4]), name="Bias2")
b3 = tf.Variable(tf.zeros([1]), name="Bias3")

b1_hist = tf.histogram_summary('biases1', b1)
b2_hist = tf.histogram_summary('biases2', b2)
b3_hist = tf.histogram_summary('biases3', b3)

with tf.name_scope('layer2') as scope:
    L2 = tf.sigmoid(tf.matmul(X, W1) + b1)

with tf.name_scope('layer3') as scope:
    L3 = tf.sigmoid(tf.matmul(L2, W2) + b2)

with tf.name_scope('layer4') as scope:
    hypothesis = tf.sigmoid(tf.matmul(L3, W3) + b3)

with tf.name_scope('cost') as scope:
    cost = -tf.reduce_mean(Y*tf.log(hypothesis) + (1-Y)*tf.log(1-hypothesis))
    cost_summ = tf.scalar_summary('cost', cost)

a = tf.Variable(0.1)
with tf.name_scope('train') as scope:
    optimizer = tf.train.GradientDescentOptimizer(a)
    train = optimizer.minimize(cost)

correct_prediction = tf.equal(tf.floor(hypothesis+0.5), Y)
accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))
accuracy_summ = tf.scalar_summary('accuracy', accuracy)

init = tf.initialize_all_variables()

with tf.Session() as sess:
    sess.run(init)

    # python3 /usr/local/bin/tensorboard --logdir=./logs/xor_logs/
    merged = tf.merge_all_summaries()
    writer = tf.train.SummaryWriter("./logs/xor_logs", sess.graph_def)

    for step in range(10000):
        sess.run(train, feed_dict={X:x_data, Y:y_data})
        if step % 1000 == 0:
            summary = sess.run(merged, feed_dict={X:x_data, Y:y_data})
            writer.add_summary(summary, step)
            print(step, sess.run(cost, feed_dict={X:x_data, Y:y_data}), sess.run(W1), sess.run(W2), sess.run(W3))

    # Test model
    print(sess.run([hypothesis, tf.floor(hypothesis+0.5), correct_prediction, accuracy], feed_dict={X:x_data, Y:y_data}))
    print("Accuracy: ", accuracy.eval({X:x_data, Y:y_data}))
